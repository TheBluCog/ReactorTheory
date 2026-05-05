import { requireRole } from './_auth';
import { writeAudit } from './_audit';

export default function handler(req: any, res: any) {
  const session = requireRole(req, res, 'advisor');

  if (!session) {
    writeAudit(req, {
      event: 'ACCESS_DENIED',
      result: 'deny',
      reason: 'INSUFFICIENT_ROLE_OR_NO_SESSION',
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

  return res.status(200).json({
    ok: true,
    role: session.role,
    level: session.level,
    message: 'Protected advisory layer accessed',
    valuation_signal: 'ACTIVE',
  });
}
