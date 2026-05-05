import { sendAlert } from './_alerts';

export type AnomalyInput = {
  event: string;
  actor?: string;
  role?: string;
  level?: number;
  result?: 'allow' | 'deny' | 'error' | 'info';
  endpoint?: string;
  metadata?: Record<string, unknown>;
};

const WINDOW_MS = 5 * 60 * 1000;
const FAILED_THRESHOLD = 3;
const OPERATOR_THRESHOLD = 1;

// Serverless note: this in-memory store is best-effort only.
// Production upgrade: persist counters in Redis, Upstash, Postgres, or SIEM.
const memory = (globalThis as any).__ARTYMUS_ANOMALY__ || {
  failures: new Map<string, number[]>(),
  operator: new Map<string, number[]>(),
};
(globalThis as any).__ARTYMUS_ANOMALY__ = memory;

function now() {
  return Date.now();
}

function key(req: any, actor?: string) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return actor || ip || 'anonymous';
}

function prune(arr: number[]) {
  const cutoff = now() - WINDOW_MS;
  return arr.filter((t) => t >= cutoff);
}

function push(map: Map<string, number[]>, k: string) {
  const arr = prune(map.get(k) || []);
  arr.push(now());
  map.set(k, arr);
  return arr.length;
}

export async function detectAnomaly(req: any, input: AnomalyInput) {
  const k = key(req, input.actor);

  if (input.result === 'deny' || input.event === 'ACCESS_DENIED') {
    const count = push(memory.failures, k);
    if (count >= FAILED_THRESHOLD) {
      return sendAlert(req, {
        severity: 'critical',
        title: 'Repeated denied access attempts detected',
        actor: input.actor,
        role: input.role,
        endpoint: input.endpoint || req.url,
        reason: 'REPEATED_DENIED_ACCESS',
        metadata: { count, window_ms: WINDOW_MS, ...input.metadata },
      });
    }
  }

  if (input.role === 'operator' || input.level === 3 || input.event === 'OPERATOR_ACCESS') {
    const count = push(memory.operator, k);
    if (count >= OPERATOR_THRESHOLD) {
      return sendAlert(req, {
        severity: 'critical',
        title: 'Operator access anomaly observed',
        actor: input.actor,
        role: input.role,
        endpoint: input.endpoint || req.url,
        reason: 'OPERATOR_ACCESS_OBSERVED',
        metadata: { count, window_ms: WINDOW_MS, ...input.metadata },
      });
    }
  }

  return { ok: true, anomaly: false };
}
