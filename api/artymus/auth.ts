type Role = 'collector' | 'advisor' | 'operator';

const ROLE_PHRASES: Record<string, Role> = {
  'something there': 'collector',
  'maybe': 'collector',
  'shauna': 'collector',
  'provenance': 'advisor',
  'art is signal': 'operator',
  'artymus': 'operator',
};

const ROLE_PAYLOADS: Record<Role, { role: Role; label: string; level: number; access: string[]; redirect: string }> = {
  collector: { role: 'collector', label: 'Collector', level: 1, access: ['plates'], redirect: '/ui/artymus-3-plates.html' },
  advisor: { role: 'advisor', label: 'Advisor', level: 2, access: ['plates', 'intelligence-read'], redirect: '/ui/artymus-3-intelligence.html' },
  operator: { role: 'operator', label: 'Operator', level: 3, access: ['plates', 'intelligence-read', 'execution-links', 'rt11-console'], redirect: '/ui/artymus-3-intelligence.html' },
};

function normalize(input: unknown): string {
  return String(input || '').trim().toLowerCase();
}

function setSessionCookie(req: any, res: any, role: Role) {
  const isLocal = String(req.headers.host || '').includes('localhost');
  const secure = isLocal ? '' : '; Secure';
  const token = encodeURIComponent(JSON.stringify({ role, issued_at: Date.now() }));
  res.setHeader('Set-Cookie', `artymus_session=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=3600`);
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const phrase = normalize(req.body?.phrase);
  const role = ROLE_PHRASES[phrase];

  if (!role) return res.status(401).json({ ok: false, error: 'ACCESS_NOT_RECOGNIZED', message: 'Not yet. Look again.' });

  setSessionCookie(req, res, role);

  return res.status(200).json({
    ok: true,
    ...ROLE_PAYLOADS[role],
    issued_at: new Date().toISOString(),
    expires_in_seconds: 3600,
  });
}
