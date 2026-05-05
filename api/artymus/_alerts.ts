import { writeAudit } from './_audit';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertEvent = {
  severity: AlertSeverity;
  title: string;
  actor?: string;
  role?: string;
  endpoint?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
};

function shouldNotify(alert: AlertEvent) {
  return alert.severity === 'warning' || alert.severity === 'critical';
}

function alertWebhook() {
  return (globalThis as any).process?.env?.ARTYMUS_ALERT_WEBHOOK_URL || '';
}

export async function sendAlert(req: any, alert: AlertEvent) {
  const record = writeAudit(req, {
    event: `ALERT_${alert.severity.toUpperCase()}`,
    actor: alert.actor,
    role: alert.role,
    endpoint: alert.endpoint || req.url,
    method: req.method,
    result: alert.severity === 'critical' ? 'error' : 'info',
    reason: alert.reason || alert.title,
    metadata: alert.metadata || {},
  });

  if (!shouldNotify(alert)) return { ok: true, delivered: false, record };

  const webhook = alertWebhook();
  if (!webhook) return { ok: true, delivered: false, record };

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `[ARTYMUS ${alert.severity.toUpperCase()}] ${alert.title}`, alert, audit: record }),
    });
    return { ok: response.ok, delivered: response.ok, status: response.status, record };
  } catch (error: any) {
    return { ok: false, delivered: false, error: String(error?.message || error), record };
  }
}

export async function alertDeniedAccess(req: any, reason: string, metadata: Record<string, unknown> = {}) {
  return sendAlert(req, { severity: 'warning', title: 'Denied access attempt', reason, metadata });
}

export async function alertOperatorAccess(req: any, actor: string, role: string, metadata: Record<string, unknown> = {}) {
  return sendAlert(req, { severity: 'critical', title: 'Operator-level access observed', actor, role, reason: 'OPERATOR_ACCESS', metadata });
}
