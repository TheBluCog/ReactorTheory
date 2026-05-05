import { sendAlert } from './_alerts';

export type BehaviorEvent = {
  actor?: string;
  role?: string;
  level?: number;
  endpoint?: string;
  method?: string;
  result?: 'allow' | 'deny' | 'error' | 'info';
  metadata?: Record<string, unknown>;
};

export type BehaviorProfile = {
  actor: string;
  first_seen: string;
  last_seen: string;
  total_events: number;
  denied_events: number;
  operator_events: number;
  endpoints: Record<string, number>;
  roles: Record<string, number>;
  risk_score: number;
};

const memory = (globalThis as any).__ARTYMUS_BEHAVIOR__ || new Map<string, BehaviorProfile>();
(globalThis as any).__ARTYMUS_BEHAVIOR__ = memory;

function actorKey(req: any, actor?: string) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  return actor || ip || 'anonymous';
}

function risk(profile: BehaviorProfile) {
  let score = 0;
  score += Math.min(profile.denied_events * 18, 54);
  score += Math.min(profile.operator_events * 30, 60);
  score += Math.min(Object.keys(profile.endpoints).length * 3, 18);
  return Math.min(score, 100);
}

export async function updateBehaviorModel(req: any, event: BehaviorEvent) {
  const actor = actorKey(req, event.actor);
  const now = new Date().toISOString();
  const endpoint = event.endpoint || req.url || 'unknown';
  const role = event.role || 'none';

  const profile: BehaviorProfile = memory.get(actor) || {
    actor,
    first_seen: now,
    last_seen: now,
    total_events: 0,
    denied_events: 0,
    operator_events: 0,
    endpoints: {},
    roles: {},
    risk_score: 0,
  };

  profile.last_seen = now;
  profile.total_events += 1;
  profile.endpoints[endpoint] = (profile.endpoints[endpoint] || 0) + 1;
  profile.roles[role] = (profile.roles[role] || 0) + 1;

  if (event.result === 'deny') profile.denied_events += 1;
  if (event.role === 'operator' || event.level === 3) profile.operator_events += 1;

  profile.risk_score = risk(profile);
  memory.set(actor, profile);

  if (profile.risk_score >= 75) {
    await sendAlert(req, {
      severity: 'critical',
      title: 'High-risk behavior profile detected',
      actor,
      role,
      endpoint,
      reason: 'BEHAVIOR_RISK_THRESHOLD',
      metadata: { profile, event },
    });
  } else if (profile.risk_score >= 45) {
    await sendAlert(req, {
      severity: 'warning',
      title: 'Elevated behavior risk observed',
      actor,
      role,
      endpoint,
      reason: 'BEHAVIOR_RISK_ELEVATED',
      metadata: { profile, event },
    });
  }

  return profile;
}

export function getBehaviorProfile(req: any, actor?: string) {
  return memory.get(actorKey(req, actor)) || null;
}
