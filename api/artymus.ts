function writeJson(res: any, status: number, payload: Record<string, unknown>) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(status).json(payload);
}

function basePayload(req: any) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'reactor-theory.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  return {
    ok: true,
    service: 'ARTYMUS',
    version: '3.0.1',
    stack: 'RT11 / Ethic Vault ReactorCore',
    mode: 'demo/testnet-next',
    status: 'LIVE',
    route: '/api/artymus.ts',
    baseUrl,
    runtime: {
      node: process.version,
      vercelEnv: process.env.VERCEL_ENV || 'local',
      deployment: process.env.VERCEL_URL || host,
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
    timestamp: new Date().toISOString(),
  };
}

const governance = {
  posture: 'governance-first',
  execution: 'demo-default',
  allowedActions: ['ALLOW', 'HOLD', 'BLOCK'],
  mode: 'ADVISORY',
  invariants: [
    'No hidden probabilistic state',
    'No silent mutation',
    'No unverifiable governance',
    'No drift without detection',
    'No execution without state',
  ],
  flow: 'state -> proof -> control -> audit -> verification',
};

const resonance = {
  deterministic: true,
  hidden_probabilistic_state: false,
  randomness_allowed: false,
  auditable: true,
  dimensions: {
    relational_context: 0.8,
    signal_to_noise: 0.75,
    feedback_loops: 0.78,
    distributed_accountability: 0.72,
    cultural_sensitivity: 0.81,
  },
};

export default function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const action = typeof req.query?.action === 'string' ? req.query.action : 'root';
  const base = basePayload(req);

  if (action === 'health') {
    writeJson(res, 200, { ...base, health: 'green' });
    return;
  }

  if (action === 'links') {
    writeJson(res, 200, {
      ...base,
      links: {
        main: `${base.baseUrl}`,
        apiRoot: `${base.baseUrl}/api/artymus`,
        apiHealth: `${base.baseUrl}/api/artymus?action=health`,
        apiGovernance: `${base.baseUrl}/api/artymus?action=governance`,
        apiResonance: `${base.baseUrl}/api/artymus?action=resonance`,
        debug: `${base.baseUrl}/api/debug`,
        debugDiagnostics: `${base.baseUrl}/api/debug?action=diagnostics`,
        debugRepairPlan: `${base.baseUrl}/api/debug?action=repair-plan`,
      },
    });
    return;
  }

  if (action === 'governance') {
    writeJson(res, 200, { ...base, governance });
    return;
  }

  if (action === 'resonance') {
    writeJson(res, 200, { ...base, resonance });
    return;
  }

  if (action === 'diagnostics') {
    writeJson(res, 200, {
      ...base,
      diagnostics: {
        apiJsonContract: 'ok=true; service=ARTYMUS; content-type=application/json',
        canonicalRoute: 'api/artymus.ts',
        staticFallback: 'public/api/artymus',
        removedRoute: 'api/artymus/index.ts',
        debugRoute: 'api/debug.ts',
        ciVerifier: 'scripts/check-artymus-api.cjs',
      },
      governance,
      resonance,
    });
    return;
  }

  writeJson(res, 200, {
    ...base,
    message: 'ARTYMUS API root online.',
    endpoints: [
      '/api/artymus',
      '/api/artymus?action=health',
      '/api/artymus?action=links',
      '/api/artymus?action=governance',
      '/api/artymus?action=resonance',
      '/api/artymus?action=diagnostics',
      '/api/debug',
    ],
    governance,
    resonance,
  });
}
