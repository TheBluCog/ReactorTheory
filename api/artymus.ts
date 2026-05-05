type Role = 'collector' | 'advisor' | 'operator';

type TrustScore = { score: number; band: string; permissions: string[]; requireReauth: boolean; reason: string[] };

type RiskDecision = { allow: boolean; requireReauth: boolean; requireHumanApproval: boolean; risk: number; band: string; reason: string[] };

const ROLE_PHRASES: Record<string, Role> = {
  'something there': 'collector',
  'maybe': 'collector',
  'shauna': 'collector',
  'provenance': 'advisor',
  'art is signal': 'operator',
  'artymus': 'operator',
};

const ROLE_LEVEL: Record<Role, number> = { collector: 1, advisor: 2, operator: 3 };

const ROLE_ACCESS: Record<Role, string[]> = {
  collector: ['plates'],
  advisor: ['plates', 'intelligence-read'],
  operator: ['plates', 'intelligence-read', 'execution-links', 'rt11-console'],
};

const runtimeState = (globalThis as any).__ARTYMUS_RUNTIME__ || { started_at: new Date().toISOString(), events: [], nodes: {}, globalNodes: {} };
(globalThis as any).__ARTYMUS_RUNTIME__ = runtimeState;

function normalize(input: unknown) { return String(input || '').trim().toLowerCase(); }

function parseCookies(cookieHeader = ''): Record<string, string> {
  return Object.fromEntries(cookieHeader.split(';').map((c) => c.trim()).filter(Boolean).map((c) => {
    const idx = c.indexOf('=');
    return [decodeURIComponent(c.slice(0, idx)), decodeURIComponent(c.slice(idx + 1))];
  }));
}

function sessionFromReq(req: any) {
  const cookies = parseCookies(req.headers.cookie || '');
  if (!cookies.artymus_session) return null;
  try {
    const raw = JSON.parse(cookies.artymus_session);
    const role = (raw.role || 'collector') as Role;
    return { sub: raw.sub || 'session-user', role, level: ROLE_LEVEL[role] || 1, access: ROLE_ACCESS[role] || [] };
  } catch {
    return null;
  }
}

function requireRole(req: any, res: any, min: Role) {
  const session = sessionFromReq(req);
  if (!session) { res.status(401).json({ ok: false, error: 'NO_VALID_SESSION' }); return null; }
  if (session.level < ROLE_LEVEL[min]) { res.status(403).json({ ok: false, error: 'INSUFFICIENT_ROLE', required: min, role: session.role }); return null; }
  return session;
}

function setSessionCookie(req: any, res: any, role: Role, subject = 'session-user') {
  const isLocal = String(req.headers.host || '').includes('localhost');
  const secure = isLocal ? '' : '; Secure';
  const token = encodeURIComponent(JSON.stringify({ role, sub: subject, issued_at: Date.now() }));
  res.setHeader('Set-Cookie', `artymus_session=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=3600`);
}

function calculateTrust(role: Role, level: number): TrustScore {
  let score = 50 + level * 12;
  if (role === 'operator') score += 12;
  score = Math.max(0, Math.min(100, score));
  const permissions = [] as string[];
  if (score >= 35) permissions.push('plates');
  if (score >= 55 && level >= 2) permissions.push('intelligence-read');
  if (score >= 75 && level >= 3) permissions.push('execution-links');
  if (score >= 85 && level >= 3) permissions.push('rt11-console');
  return { score, band: score >= 85 ? 'trusted' : score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low', permissions, requireReauth: score < 70 || (level >= 3 && score < 85), reason: ['session-bound'] };
}

function evaluateRisk(action: string, trust: TrustScore, level: number): RiskDecision {
  const base = action === 'execute' ? 45 : action === 'admin' ? 55 : action === 'advise' ? 22 : action === 'score' ? 12 : 5;
  let risk = base + Math.max(0, 100 - trust.score) * 0.45;
  const reason: string[] = [];
  if (level < 3 && (action === 'execute' || action === 'admin')) { risk += 45; reason.push('operator-required'); }
  risk = Math.max(0, Math.min(100, Math.round(risk)));
  return { allow: risk < 85 && trust.permissions.length > 0, requireReauth: risk >= 55 || trust.requireReauth, requireHumanApproval: risk >= 65 || action === 'execute' || action === 'admin', risk, band: risk >= 85 ? 'critical' : risk >= 65 ? 'high' : risk >= 35 ? 'medium' : 'low', reason };
}

function inferCommand(input: string) {
  const t = input.toLowerCase();
  if (t.includes('trust')) return 'TRUST.STATUS';
  if (t.includes('risk') || t.includes('safe')) return 'RISK.CHECK';
  if (t.includes('defense') || t.includes('defence')) return 'DEFENSE.STATUS';
  if (t.includes('intelligence') || t.includes('intel')) return 'INTEL.OPEN';
  if (t.includes('rt11') || t.includes('console')) return 'RT11.CONSOLE';
  if (t.includes('lock') || t.includes('logout')) return 'SESSION.LOCK';
  return input.toUpperCase();
}

function actionFromCommand(cmd: string) { return cmd.includes('RT11') || cmd.includes('EXECUTE') ? 'execute' : cmd.includes('RISK') ? 'score' : cmd.includes('TRUST') ? 'view' : 'advise'; }

export default async function handler(req: any, res: any) {
  const action = String(req.query?.action || req.body?.action || '').toLowerCase();

  if (action === 'auth') {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    const role = ROLE_PHRASES[normalize(req.body?.phrase)];
    if (!role) return res.status(401).json({ ok: false, error: 'ACCESS_NOT_RECOGNIZED' });
    setSessionCookie(req, res, role, normalize(req.body?.subject) || 'phrase-user');
    return res.status(200).json({ ok: true, role, label: role[0].toUpperCase() + role.slice(1), level: ROLE_LEVEL[role], access: ROLE_ACCESS[role], redirect: role === 'collector' ? '/ui/artymus-3-plates.html' : '/ui/artymus-3-intelligence.html' });
  }

  const session = requireRole(req, res, 'advisor');
  if (!session) return;
  const trust = calculateTrust(session.role, session.level);

  if (action === 'protected-example') {
    const risk = evaluateRisk('advise', trust, session.level);
    return res.status(200).json({ ok: true, role: session.role, trust, risk });
  }

  if (action === 'command' || action === 'autonomous' || action === 'governor') {
    const input = String(req.body?.command || req.body?.input || 'TRUST.STATUS');
    const cmd = inferCommand(input);
    const cmdAction = actionFromCommand(cmd);
    const risk = evaluateRisk(cmdAction, trust, session.level);
    const output: string[] = [`COMMAND=${cmd}`, `TRUST=${trust.score}/${trust.band}`, `RISK=${risk.risk}/${risk.band}`];
    let route: string | null = null;
    if (cmd === 'TRUST.STATUS') output.push(`PERMISSIONS=${trust.permissions.join(',') || 'none'}`);
    else if (cmd === 'RISK.CHECK') output.push(`REAUTH=${risk.requireReauth}`, `HUMAN_APPROVAL=${risk.requireHumanApproval}`);
    else if (cmd === 'DEFENSE.STATUS') output.push(risk.allow ? 'DEFENSE=ALLOW' : 'DEFENSE=BLOCK');
    else if (cmd === 'INTEL.OPEN') route = '/ui/artymus-3-intelligence.html';
    else if (cmd === 'RT11.CONSOLE') route = session.role === 'operator' ? '/ui/rt11-dashboard.html' : null;
    return res.status(200).json({ ok: true, command: cmd, decision: risk.allow ? 'recommend' : 'block', route, trust, risk, output });
  }

  if (action === 'runtime-state') {
    if (req.method === 'POST') runtimeState.events.push({ ts: new Date().toISOString(), actor: session.sub, payload: req.body || {} });
    runtimeState.events = runtimeState.events.slice(-100);
    return res.status(200).json({ ok: true, state: runtimeState });
  }

  if (action === 'runtime-loop' || action === 'governance-loop' || action === 'live-loop') {
    const steps = Math.min(10, Number(req.body?.steps || req.body?.cycles || req.body?.maxCycles || 3));
    const results = Array.from({ length: steps }, (_, i) => {
      const t = calculateTrust(session.role, Math.max(1, session.level - Math.floor(i / 5)) as number);
      const r = evaluateRisk(i % 3 === 0 ? 'score' : 'view', t, session.level);
      return { step: i + 1, trust: t, risk: r, decision: !r.allow ? 'block' : r.requireReauth ? 'reauth' : 'allow' };
    });
    return res.status(200).json({ ok: true, results });
  }

  if (action === 'distributed-node' || action === 'global-node') {
    const id = req.body?.nodeId || `${action}_${Date.now()}`;
    const node = { nodeId: id, trust: req.body?.trust ?? trust.score, risk: req.body?.risk ?? 25, status: req.body?.status || 'online', vote: req.body?.vote || 'allow', updated_at: new Date().toISOString() };
    if (action === 'distributed-node') runtimeState.nodes[id] = node;
    else runtimeState.globalNodes[id] = node;
    return res.status(200).json({ ok: true, node });
  }

  if (action === 'distributed-consensus') {
    const nodes = Object.values(runtimeState.nodes) as any[];
    const allow = nodes.filter(n => n.vote === 'allow').length;
    const deny = nodes.filter(n => n.vote === 'deny').length;
    const abstain = Math.max(0, nodes.length - allow - deny);
    const consensus = allow / (nodes.length || 1);
    return res.status(200).json({ ok: true, nodes: nodes.length, allow, deny, abstain, consensus, decision: consensus > 0.66 ? 'allow' : deny / (nodes.length || 1) > 0.5 ? 'deny' : 'undetermined' });
  }

  if (action === 'global-sync') {
    const nodes = Object.values(runtimeState.globalNodes) as any[];
    const avgTrust = nodes.reduce((s, n) => s + (n.trust || 0), 0) / (nodes.length || 1);
    const avgRisk = nodes.reduce((s, n) => s + (n.risk || 0), 0) / (nodes.length || 1);
    return res.status(200).json({ ok: true, nodes, avgTrust, avgRisk, health: avgTrust > 70 && avgRisk < 50 ? 'stable' : 'degraded' });
  }

  return res.status(200).json({ ok: true, actions: ['auth', 'protected-example', 'command', 'autonomous', 'governor', 'runtime-state', 'runtime-loop', 'distributed-node', 'distributed-consensus', 'global-node', 'global-sync'] });
}
