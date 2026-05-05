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

  const webhook = process.env.ARTYMUS_ALERT_WEBHOOK_URL;
  if (!webhook) {
    console.warn(JSON.stringify({ type: 'ARTYMUS_ALERT_NOT_DELIVERED', reason: 'NO_WEBHOOK_CONFIGURED', alert }));
    return { ok: true, delivered: false, record };
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[ARTYMUS ${alert.severity.toUpperCase()}] ${alert.title}`,
        alert,
        audit: record,
      }),
    });

    return { ok: response.ok, delivered: response.ok, status: response.status, record };
  } catch (error: any) {
    console.error(JSON.stringify({ type: 'ARTYMUS_ALERT_DELIVERY_ERROR', error: error.message, alert }));
    return { ok: false, delivered: false, error: error.message, record };
  }
}

export async function alertDeniedAccess(req: any, reason: string, metadata: Record<string, unknown> = {}) {
  return sendAlert(req, {
    severity: 'warning',
    title: 'Denied access attempt',
    reason,
    metadata,
  });
}

export async function alertOperatorAccess(req: any, actor: string, role: string, metadata: Record<string, unknown> = {}) {
  return sendAlert(req, {
    severity: 'critical',
    title: 'Operator-level access observed',
    actor,
    role,
    reason: 'OPERATOR_ACCESS',
    metadata,
  });
}
