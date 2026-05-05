import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');

  if (!session) return;

  const steps = Math.min(10, Number(req.body?.steps || 3));
  const results: any[] = [];

  for (let i = 0; i < steps; i += 1) {
    const trust = calculateTrust({
      role: session.role,
      level: session.level,
      sessionBound: true,
      recentSuccesses: 3 - i,
    });

    const risk = evaluateRisk({
      action: 'view',
      trust,
      role: session.role,
      level: session.level,
    });

    const decision = !risk.allow ? 'block' : risk.requireReauth ? 'reauth' : 'allow';

    results.push({
      step: i + 1,
      trust,
      risk,
      decision,
    });
  }

  writeAudit(req, {
    event: 'RUNTIME_LOOP_EXECUTED',
    actor: session.sub,
    role: session.role,
    result: 'info',
    metadata: { results },
  });

  return res.status(200).json({
    ok: true,
    results,
  });
}
