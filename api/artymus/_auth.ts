import crypto from 'crypto';

export type ArtymusRole = 'collector' | 'advisor' | 'operator';

export type ArtymusSession = {
  sub: string;
  role: ArtymusRole;
  level: number;
  access: string[];
  iat: number;
  exp: number;
};

export const ROLE_LEVEL: Record<ArtymusRole, number> = {
  collector: 1,
  advisor: 2,
  operator: 3,
};

export const ROLE_ACCESS: Record<ArtymusRole, string[]> = {
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

export function signSession(payload: ArtymusSession) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifySession(token?: string | null): ArtymusSession | null {
  if (!token) return null;
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ArtymusSession;
  if (!payload.exp || Date.now() > payload.exp * 1000) return null;
  return payload;
}

export function parseCookies(cookieHeader = ''): Record<string, string> {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const idx = c.indexOf('=');
        return [decodeURIComponent(c.slice(0, idx)), decodeURIComponent(c.slice(idx + 1))];
      })
  );
}

export function getSessionFromRequest(req: any): ArtymusSession | null {
  const cookies = parseCookies(req.headers.cookie || '');
  return verifySession(cookies.artymus_session);
}

export function requireRole(req: any, res: any, minimumRole: ArtymusRole): ArtymusSession | null {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ ok: false, error: 'NO_VALID_SESSION' });
    return null;
  }
  if (session.level < ROLE_LEVEL[minimumRole]) {
    res.status(403).json({ ok: false, error: 'INSUFFICIENT_ROLE', required: minimumRole, role: session.role });
    return null;
  }
  return session;
}

export function setSessionCookie(req: any, res: any, token: string) {
  const isLocal = String(req.headers.host || '').includes('localhost');
  const secure = isLocal ? '' : '; Secure';
  res.setHeader('Set-Cookie', `artymus_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=86400`);
}
