import { requireRole } from './_auth';
import { writeAudit } from './_audit';
import { alertDeniedAccess, alertOperatorAccess } from './_alerts';
import { detectAnomaly } from './_anomaly';

export default async function handler(req: any, res: any) {
  const session = requireRole(req, res, 'advisor');

  if (!session) {
    writeAudit(req, {
      event: 'ACCESS_DENIED',
      result: 'deny',
      reason: 'INSUFFICIENT_ROLE_OR_NO_SESSION',
    });

    await alertDeniedAccess(req, 'Advisor-level endpoint denied', {
      endpoint: req.url,
    });

    await detectAnomaly(req, {
      event: 'ACCESS_DENIED',
      result: 'deny',
      endpoint: req.url,
    });

    return;
  }

  writeAudit(req, {
    event: 'ACCESS_GRANTED',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: 'allow',
  });

  if (session.role === 'operator') {
    await alertOperatorAccess(req, session.sub, session.role, {
      endpoint: req.url,
    });

    await detectAnomaly(req, {
      event: 'OPERATOR_ACCESS',
      actor: session.sub,
      role: session.role,
      level: session.level,
      endpoint: req.url,
    });
  }

  return res.status(200).json({
    ok: true,
    role: session.role,
    level: session.level,
    message: 'Protected advisory layer accessed',
    valuation_signal: 'ACTIVE',
  });
}
