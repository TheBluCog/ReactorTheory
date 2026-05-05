import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

type AutonomousMode = 'observe' | 'assist' | 'execute-safe';

function normalize(input: unknown) {
  return String(input || '').trim().toLowerCase();
}

function inferCommand(input: string) {
  const text = normalize(input);
  if (text.includes('open') && text.includes('intelligence')) return 'INTEL.OPEN';
  if (text.includes('open') && text.includes('rt11')) return 'RT11.CONSOLE';
  if (text.includes('trust')) return 'TRUST.STATUS';
  if (text.includes('risk') || text.includes('safe')) return 'RISK.CHECK';
  if (text.includes('defense') || text.includes('defence')) return 'DEFENSE.STATUS';
  if (text.includes('lock')) return 'SESSION.LOCK';
  return text.toUpperCase();
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const mode: AutonomousMode = req.body?.mode || 'assist';
  const input = String(req.body?.input || req.body?.command || '');
  const command = inferCommand(input);

  const trust = calculateTrust({
    role: session.role,
    level: session.level,
    sessionBound: true,
    recentSuccesses: 3,
    deniedEvents: 0,
    operatorEvents: session.role === 'operator' ? 1 : 0,
    anomalyRisk: 0,
  });

  const action = command.includes('RT11') || command.includes('EXECUTE') ? 'execute' : command.includes('RISK') ? 'score' : 'view';
  const risk = evaluateRisk({ action: action as any, trust, role: session.role, level: session.level });

  const autonomousAllowed = mode === 'execute-safe' && risk.allow && !risk.requireReauth && !risk.requireHumanApproval;

  let decision: 'observe' | 'recommend' | 'execute' | 'block' = 'recommend';
  let route: string | null = null;
  const output: string[] = [];

  if (!risk.allow) decision = 'block';
  else if (mode === 'observe') decision = 'observe';
  else if (autonomousAllowed) decision = 'execute';

  if (command === 'INTEL.OPEN') route = '/ui/artymus-3-intelligence.html';
  if (command === 'RT11.CONSOLE') route = '/ui/rt11-dashboard.html';

  output.push(`MODE=${mode}`);
  output.push(`COMMAND=${command}`);
  output.push(`DECISION=${decision.toUpperCase()}`);
  output.push(`TRUST=${trust.score}/${trust.band}`);
  output.push(`RISK=${risk.risk}/${risk.band}`);

  if (risk.requireReauth) output.push('REAUTH_REQUIRED=true');
  if (risk.requireHumanApproval) output.push('HUMAN_APPROVAL_REQUIRED=true');
  if (route && decision === 'execute') output.push(`ROUTE=${route}`);

  writeAudit(req, {
    event: 'AUTONOMOUS_DECISION',
    actor: session.sub,
    role: session.role,
    level: session.level,
    result: decision === 'block' ? 'deny' : 'allow',
    metadata: { mode, input, command, decision, trust, risk, route },
  });

  return res.status(200).json({ ok: true, mode, command, decision, route: decision === 'execute' ? route : null, trust, risk, output });
}
