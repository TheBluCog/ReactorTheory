import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const cycles = Math.max(1, Math.min(Number(req.body?.cycles || 1), 10));
  const mode = String(req.body?.mode || 'assist');
  const decisions = [];

  for (let i = 0; i < cycles; i += 1) {
    const trust = calculateTrust({
      role: session.role,
      level: session.level,
      sessionBound: true,
      recentSuccesses: Math.max(0, 3 - i),
      deniedEvents: 0,
      operatorEvents: session.role === 'operator' ? 1 : 0,
      anomalyRisk: i * 3,
    });

    const risk = evaluateRisk({
      action: i % 3 === 0 ? 'score' : 'view',
      trust,
      role: session.role,
      level: session.level,
      anomalyRisk: i * 3,
      drift: 28 + i,
      confidence: 91 - i,
    });

    const decision = !risk.allow ? 'block' : risk.requireReauth ? 'reauth' : mode === 'execute-safe' && !risk.requireHumanApproval ? 'execute' : 'recommend';

    decisions.push({ cycle: i + 1, trust, risk, decision });
  }

  writeAudit(req, {
    event: 'CONTINUOUS_GOVERNANCE_LOOP',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: 'info',
    metadata: { mode, cycles, decisions },
  });

  return res.status(200).json({ ok: true, mode, cycles, decisions });
}
