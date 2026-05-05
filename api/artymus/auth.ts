import crypto from 'crypto';

type Role = 'collector' | 'advisor' | 'operator';

type AuthBody = {
  phrase?: string;
  subject?: string;
};

const ROLE_PHRASES: Record<string, Role> = {
  'something there': 'collector',
  'maybe': 'collector',
  'shauna': 'collector',
  'provenance': 'advisor',
  'art is signal': 'operator',
  'artymus': 'operator',
};

const ROLE_PAYLOADS: Record<Role, { role: Role; label: string; level: number; access: string[]; redirect: string }> = {
  collector: {
    role: 'collector',
    label: 'Collector',
    level: 1,
    access: ['plates'],
    redirect: '/ui/artymus-3-plates.html',
  },
  advisor: {
    role: 'advisor',
    label: 'Advisor',
    level: 2,
    access: ['plates', 'intelligence-read'],
    redirect: '/ui/artymus-3-intelligence.html',
  },
  operator: {
    role: 'operator',
    label: 'Operator',
    level: 3,
    access: ['plates', 'intelligence-read', 'execution-links', 'rt11-console'],
    redirect: '/ui/artymus-3-intelligence.html',
  },
};

function normalize(input: unknown): string {
  return String(input || '').trim().toLowerCase();
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function getSecret() {
  return process.env.ARTYMUS_AUTH_SECRET || 'dev-only-change-me';
}

function signSession(payload: object) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

function setSessionCookie(req: any, res: any, token: string) {
  const isLocal = String(req.headers.host || '').includes('localhost');
  const secure = isLocal ? '' : '; Secure';
  res.setHeader(
    'Set-Cookie',
    `artymus_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=86400`
  );
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const body: AuthBody = req.body || {};
  const phrase = normalize(body.phrase);
  const role = ROLE_PHRASES[phrase];

  if (!role) {
    return res.status(401).json({
      ok: false,
      error: 'ACCESS_NOT_RECOGNIZED',
      message: 'Not yet. Look again.',
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const session = {
    sub: normalize(body.subject) || 'phrase-user',
    role,
    level: ROLE_PAYLOADS[role].level,
    access: ROLE_PAYLOADS[role].access,
    iat: now,
    exp: now + 86400,
  };

  const token = signSession(session);
  setSessionCookie(req, res, token);

  return res.status(200).json({
    ok: true,
    ...ROLE_PAYLOADS[role],
    issued_at: new Date(now * 1000).toISOString(),
    expires_at: new Date((now + 86400) * 1000).toISOString(),
    note: 'Signed HttpOnly session issued. Replace phrase recognition with invite/OAuth before real production deployment.',
  });
}
