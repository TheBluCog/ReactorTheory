import crypto from 'crypto';

type Role = 'collector' | 'advisor' | 'operator';

const ROLE_ORDER: Record<Role, number> = {
  collector: 1,
  advisor: 2,
  operator: 3,
};

const ROLE_ACCESS: Record<Role, string[]> = {
  collector: ['plates'],
  advisor: ['plates', 'intelligence-read'],
  operator: ['plates', 'intelligence-read', 'execution-links', 'rt11-console'],
};

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function secret() {
  return process.env.ARTYMUS_AUTH_SECRET || 'dev-only-change-me';
}

function sign(payload: object) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verify(token: string) {
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && Date.now() > payload.exp * 1000) return null;
  return payload;
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(cookieHeader.split(';').map((c) => c.trim().split('=').map(decodeURIComponent)).filter((p) => p.length === 2));
}

function issueCookie(res: any, token: string) {
  res.setHeader('Set-Cookie', `artymus_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=86400`);
}

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie || '');
    const payload = cookies.artymus_session ? verify(cookies.artymus_session) : null;
    if (!payload) return res.status(401).json({ ok: false, error: 'NO_VALID_SESSION' });
    return res.status(200).json({ ok: true, role: payload.role, access: ROLE_ACCESS[payload.role as Role], level: ROLE_ORDER[payload.role as Role] });
  }

  if (req.method === 'POST') {
    const { role = 'collector', subject = 'guest' } = req.body || {};
    if (!ROLE_ACCESS[role as Role]) return res.status(400).json({ ok: false, error: 'INVALID_ROLE' });
    const now = Math.floor(Date.now() / 1000);
    const token = sign({ sub: subject, role, iat: now, exp: now + 86400 });
    issueCookie(res, token);
    return res.status(200).json({ ok: true, role, access: ROLE_ACCESS[role as Role], level: ROLE_ORDER[role as Role] });
  }

  return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
}
