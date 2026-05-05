import { requireRole } from './_auth';
import { writeAudit } from './_audit';
import { alertDeniedAccess, alertOperatorAccess } from './_alerts';
import { detectAnomaly } from './_anomaly';
import { updateBehaviorModel } from './_behavior';
import { calculateTrust } from './_trust';
import { enforceTrust } from './_defense';

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');

  if (!session) {
    writeAudit(req, { event: 'ACCESS_DENIED', result: 'deny', reason: 'NO_SESSION' });
    await alertDeniedAccess(req, 'Advisor endpoint denied');
    await detectAnomaly(req, { event: 'ACCESS_DENIED', result: 'deny' });
    await updateBehaviorModel(req, { event: 'ACCESS_DENIED', result: 'deny' });
    return;
  }

  const behavior = await updateBehaviorModel(req, {
    actor: session.sub,
    role: session.role,
    level: session.level,
    event: 'ACCESS_GRANTED',
    result: 'allow'
  });

  const trust = calculateTrust({
    role: session.role,
    level: session.level,
    deniedEvents: behavior.denied_events,
    operatorEvents: behavior.operator_events,
    anomalyRisk: behavior.risk_score,
    sessionBound: true,
    recentSuccesses: 3
  });

  const defense = await enforceTrust(req, res, trust, 'intelligence-read');
  if (defense) return;

  writeAudit(req, {
    event: 'ACCESS_GRANTED',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: 'allow'
  });

  if (session.role === 'operator') {
    await alertOperatorAccess(req, session.sub, session.role);
    await detectAnomaly(req, { event: 'OPERATOR_ACCESS', actor: session.sub, role: session.role });
  }

  return res.status(200).json({ ok: true, role: session.role, trust });
}
