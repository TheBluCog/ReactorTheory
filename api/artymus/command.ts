import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

type CommandResult = {
  ok: boolean;
  command: string;
  output: string[];
  route?: string;
  trust?: unknown;
  risk?: unknown;
};

function normalize(v: unknown) {
  return String(v || '').trim().toUpperCase();
}

function commandFromNaturalLanguage(input: string) {
  const t = input.toLowerCase();
  if (t.includes('trust')) return 'TRUST.STATUS';
  if (t.includes('risk') || t.includes('safe')) return 'RISK.CHECK';
  if (t.includes('defense') || t.includes('defence')) return 'DEFENSE.STATUS';
  if (t.includes('intelligence') || t.includes('intel')) return 'INTEL.OPEN';
  if (t.includes('rt11') || t.includes('console')) return 'RT11.CONSOLE';
  if (t.includes('lock') || t.includes('logout')) return 'SESSION.LOCK';
  return input.toUpperCase();
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const raw = String(req.body?.command || '');
  const translated = commandFromNaturalLanguage(raw);
  const cmd = normalize(translated);

  const trust = calculateTrust({
    role: session.role,
    level: session.level,
    sessionBound: true,
    recentSuccesses: 3,
    deniedEvents: 0,
    operatorEvents: session.role === 'operator' ? 1 : 0,
    anomalyRisk: 0,
  });

  const action = cmd.includes('RT11') || cmd.includes('EXECUTE') ? 'execute' : cmd.includes('RISK') ? 'score' : 'view';
  const risk = evaluateRisk({ action: action as any, trust, role: session.role, level: session.level, anomalyRisk: 0 });

  const out: CommandResult = { ok: true, command: cmd, output: [], trust, risk };

  if (cmd === 'TRUST.STATUS') out.output.push(`TRUST_SCORE=${trust.score}`, `BAND=${trust.band}`, `PERMISSIONS=${trust.permissions.join(',') || 'none'}`);
  else if (cmd === 'RISK.CHECK') out.output.push(`RISK=${risk.risk}`, `BAND=${risk.band}`, `REAUTH=${risk.requireReauth}`, `HUMAN_APPROVAL=${risk.requireHumanApproval}`);
  else if (cmd === 'DEFENSE.STATUS') out.output.push(risk.allow ? 'DEFENSE=ALLOW' : 'DEFENSE=BLOCK', `REASON=${risk.reason.join(',') || 'clear'}`);
  else if (cmd === 'INTEL.OPEN') { out.output.push('ROUTE=/ui/artymus-3-intelligence.html'); out.route = '/ui/artymus-3-intelligence.html'; }
  else if (cmd === 'RT11.CONSOLE') {
    if (session.role !== 'operator') return res.status(403).json({ ok: false, error: 'OPERATOR_REQUIRED', trust, risk });
    out.output.push('ROUTE=/ui/rt11-dashboard.html'); out.route = '/ui/rt11-dashboard.html';
  }
  else if (cmd === 'SESSION.LOCK') out.output.push('SESSION_LOCK_REQUESTED', 'REAUTH_REQUIRED');
  else out.output.push('UNKNOWN_COMMAND', 'TRY TRUST.STATUS, RISK.CHECK, DEFENSE.STATUS, INTEL.OPEN, RT11.CONSOLE');

  writeAudit(req, { event: 'COMMAND_EXECUTED', actor: session.sub, role: session.role, level: session.level, result: 'allow', metadata: { command: cmd } });
  return res.status(200).json(out);
}
