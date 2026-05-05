import { base64UrlEncode, base64UrlDecode, signHmac, timingSafeEqual } from './_crypto';

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

function secret() {
  return globalThis.process?.env?.ARTYMUS_AUTH_SECRET || 'dev-only-change-me';
}

export async function signSession(payload: ArtymusSession): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await signHmac(`${header}.${body}`, secret());
  return `${header}.${body}.${signature}`;
}

export async function verifySession(token?: string | null): Promise<ArtymusSession | null> {
  if (!token) return null;
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = await signHmac(`${header}.${body}`, secret());
  if (!(await timingSafeEqual(sig, expected))) return null;
  const payload = JSON.parse(base64UrlDecode(body)) as ArtymusSession;
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

export async function getSessionFromRequest(req: any): Promise<ArtymusSession | null> {
  const cookies = parseCookies(req.headers.cookie || '');
  return verifySession(cookies.artymus_session);
}

export async function requireRole(req: any, res: any, minimumRole: ArtymusRole): Promise<ArtymusSession | null> {
  const session = await getSessionFromRequest(req);
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
