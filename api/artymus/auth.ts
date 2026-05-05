type Role = 'collector' | 'advisor' | 'operator';

type AuthBody = {
  phrase?: string;
};

const ROLE_PHRASES: Record<string, Role> = {
  'something there': 'collector',
  'maybe': 'collector',
  'shauna': 'collector',
  'provenance': 'advisor',
  'art is signal': 'operator',
  'artymus': 'operator',
};

const ROLE_PAYLOADS: Record<Role, { role: Role; label: string; access: string[]; redirect: string }> = {
  collector: {
    role: 'collector',
    label: 'Collector',
    access: ['plates'],
    redirect: '/ui/artymus-3-plates.html',
  },
  advisor: {
    role: 'advisor',
    label: 'Advisor',
    access: ['plates', 'intelligence-read'],
    redirect: '/ui/artymus-3-intelligence.html',
  },
  operator: {
    role: 'operator',
    label: 'Operator',
    access: ['plates', 'intelligence-read', 'execution-links', 'rt11-console'],
    redirect: '/ui/artymus-3-intelligence.html',
  },
};

function normalize(input: unknown): string {
  return String(input || '').trim().toLowerCase();
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

  return res.status(200).json({
    ok: true,
    ...ROLE_PAYLOADS[role],
    issued_at: new Date().toISOString(),
    note: 'Prototype phrase access. Replace with identity provider before production use.',
  });
}
