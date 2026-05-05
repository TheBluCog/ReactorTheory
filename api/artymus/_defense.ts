import { writeAudit } from './_audit';
import { sendAlert } from './_alerts';
import type { TrustScore } from './_trust';

export type DefenseDecision = {
  allow: boolean;
  action: 'allow' | 'reauth' | 'restrict' | 'quarantine';
  status: number;
  reason: string;
};

export async function enforceTrust(req: any, res: any, trust: TrustScore, requiredPermission: string): Promise<DefenseDecision | null> {
  if (trust.score < 35) {
    const decision: DefenseDecision = { allow: false, action: 'quarantine', status: 423, reason: 'TRUST_QUARANTINE' };
    writeAudit(req, { event: 'AUTO_DEFENSE_QUARANTINE', result: 'deny', reason: decision.reason, metadata: { trust } });
    await sendAlert(req, { severity: 'critical', title: 'Auto-defense quarantine triggered', reason: decision.reason, metadata: { trust } });
    res.status(decision.status).json({ ok: false, error: decision.reason, trust });
    return decision;
  }

  if (trust.requireReauth) {
    const decision: DefenseDecision = { allow: false, action: 'reauth', status: 401, reason: 'REAUTH_REQUIRED' };
    writeAudit(req, { event: 'AUTO_DEFENSE_REAUTH_REQUIRED', result: 'deny', reason: decision.reason, metadata: { trust } });
    res.status(decision.status).json({ ok: false, error: decision.reason, trust });
    return decision;
  }

  if (!trust.permissions.includes(requiredPermission)) {
    const decision: DefenseDecision = { allow: false, action: 'restrict', status: 403, reason: 'TRUST_PERMISSION_RESTRICTED' };
    writeAudit(req, { event: 'AUTO_DEFENSE_RESTRICTED', result: 'deny', reason: decision.reason, metadata: { trust, requiredPermission } });
    res.status(decision.status).json({ ok: false, error: decision.reason, trust });
    return decision;
  }

  writeAudit(req, { event: 'AUTO_DEFENSE_ALLOW', result: 'allow', reason: 'TRUST_ACCEPTED', metadata: { trust, requiredPermission } });
  return null;
}
