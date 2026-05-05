import { requireRole } from './_auth';
import { writeAudit } from './_audit';

const state = (globalThis as any).__ARTYMUS_RUNTIME_STATE__ || {
  started_at: new Date().toISOString(),
  cycles: [],
  sessions: {},
  status: 'ONLINE',
};
(globalThis as any).__ARTYMUS_RUNTIME_STATE__ = state;

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, state });
  }

  if (req.method === 'POST') {
    const event = {
      ts: new Date().toISOString(),
      actor: session.sub,
      role: session.role,
      type: req.body?.type || 'manual',
      payload: req.body?.payload || {},
    };
    state.cycles.push(event);
    state.cycles = state.cycles.slice(-100);
    state.sessions[session.sub] = { role: session.role, last_seen: event.ts };
    writeAudit(req, { event: 'RUNTIME_STATE_UPDATED', actor: session.sub, role: session.role, result: 'info', metadata: event });
    return res.status(200).json({ ok: true, state });
  }

  return res.status(405).json({ ok: false });
}
