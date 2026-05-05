export type AuditEvent = {
  event: string;
  actor?: string;
  role?: string;
  level?: number;
  endpoint?: string;
  method?: string;
  result?: 'allow' | 'deny' | 'error' | 'info';
  reason?: string;
  metadata?: Record<string, unknown>;
};

function safeIp(req: any) {
  const forwarded = String(req.headers['x-forwarded-for'] || '');
  return forwarded.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

export function writeAudit(req: any, entry: AuditEvent) {
  const record = {
    ts: new Date().toISOString(),
    event: entry.event,
    actor: entry.actor || 'anonymous',
    role: entry.role || 'none',
    level: entry.level || 0,
    endpoint: entry.endpoint || req.url || 'unknown',
    method: entry.method || req.method || 'unknown',
    result: entry.result || 'info',
    reason: entry.reason || null,
    ip: safeIp(req),
    user_agent: req.headers['user-agent'] || 'unknown',
    metadata: entry.metadata || {},
  };

  // Vercel/serverless-safe audit sink: structured logs.
  // Production upgrade: forward this JSON to database/SIEM/log drain.
  console.log(JSON.stringify({ type: 'ARTYMUS_AUDIT', ...record }));
  return record;
}
