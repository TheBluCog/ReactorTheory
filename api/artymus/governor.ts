import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

type GovernorMode = 'observe' | 'assist' | 'execute-safe';

function modeFrom(input: unknown): GovernorMode {
  const mode = String(input || 'assist').toLowerCase();
  if (mode === 'observe' || mode === 'execute-safe') return mode;
  return 'assist';
}

function inferIntent(input: string) {
  const t = input.toLowerCase();
  if (t.includes('execute') || t.includes('payout') || t.includes('rt11')) return 'execute';
  if (t.includes('risk') || t.includes('safe') || t.includes('score')) return 'score';
  if (t.includes('advise') || t.includes('value') || t.includes('valuation')) return 'advise';
  return 'view';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const input = String(req.body?.input || req.body?.command || '');
  const mode = modeFrom(req.body?.mode);
  const action = inferIntent(input);

  const trust = calculateTrust({
    role: session.role,
    level: session.level,
    sessionBound: true,
    recentSuccesses: 3,
    deniedEvents: 0,
    operatorEvents: session.role === 'operator' ? 1 : 0,
    anomalyRisk: 0,
  });

  const risk = evaluateRisk({
    action: action as any,
    trust,
    role: session.role,
    level: session.level,
    amountUsd: Number(req.body?.amountUsd || 0) || undefined,
    anomalyRisk: 0,
    confidence: 91,
    drift: 28,
  });

  let decision: 'observe' | 'recommend' | 'execute' | 'block' = 'recommend';
  if (!risk.allow) decision = 'block';
  else if (mode === 'observe') decision = 'observe';
  else if (mode === 'execute-safe' && !risk.requireReauth && !risk.requireHumanApproval) decision = 'execute';

  const directives: string[] = [];
  directives.push(`MODE=${mode}`);
  directives.push(`ACTION=${action}`);
  directives.push(`DECISION=${decision}`);
  directives.push(`TRUST=${trust.score}/${trust.band}`);
  directives.push(`RISK=${risk.risk}/${risk.band}`);
  if (risk.requireReauth) directives.push('REAUTH_REQUIRED');
  if (risk.requireHumanApproval) directives.push('HUMAN_APPROVAL_REQUIRED');

  writeAudit(req, {
    event: 'SELF_GOVERNING_DECISION',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: decision === 'block' ? 'deny' : 'allow',
    metadata: { input, mode, action, decision, trust, risk },
  });

  return res.status(200).json({ ok: true, input, mode, action, decision, trust, risk, directives });
}
