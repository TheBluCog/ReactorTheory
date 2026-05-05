import { requireRole } from './_auth';

export default function handler(req: any, res: any) {
  // Require at least advisor-level access
  const session = requireRole(req, res, 'advisor');
  if (!session) return; // response already sent

  return res.status(200).json({
    ok: true,
    message: 'Protected data accessed',
    role: session.role,
    level: session.level,
    access: session.access,
    example: {
      valuation_signal: 'ACTIVE',
      advisory_mode: true,
    },
  });
}
