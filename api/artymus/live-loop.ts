import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const intervalMs = Math.max(5000, Math.min(Number(req.body?.intervalMs || 30000), 300000));
  const maxCycles = Math.max(1, Math.min(Number(req.body?.maxCycles || 3), 25));
  const mode = String(req.body?.mode || 'assist');

  const loopId = `loop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const cycles = [];

  for (let i = 0; i < maxCycles; i += 1) {
    const trust = calculateTrust({
      role: session.role,
      level: session.level,
      sessionBound: true,
      recentSuccesses: Math.max(0, 5 - i),
      deniedEvents: 0,
      operatorEvents: session.role === 'operator' ? 1 : 0,
      anomalyRisk: i * 4,
    });

    const risk = evaluateRisk({
      action: i % 5 === 0 ? 'score' : 'view',
      trust,
      role: session.role,
      level: session.level,
      anomalyRisk: i * 4,
      drift: 25 + i,
      confidence: 92 - i,
    });

    const decision = !risk.allow ? 'block' : risk.requireReauth ? 'reauth' : mode === 'execute-safe' && !risk.requireHumanApproval ? 'execute' : 'recommend';
    cycles.push({ cycle: i + 1, decision, trust, risk });
  }

  writeAudit(req, {
    event: 'LIVE_LOOP_ENGINE_STARTED',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: 'info',
    metadata: { loopId, intervalMs, maxCycles, mode, cycles },
  });

  return res.status(200).json({ ok: true, loopId, intervalMs, maxCycles, mode, cycles, note: 'Serverless-safe loop simulation. Production persistence requires Redis/DB plus scheduler.' });
}
