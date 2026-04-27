function parseBody(req: any) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return typeof req.body === 'object' ? req.body : {}
}

function clamp(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value ?? fallback)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function buildCore(body: any) {
  return {
    E: clamp(body.E, 92, 0, 100),
    I: clamp(body.I, 88, 0, 100),
    C: clamp(body.C, 84, 0, 100),
    D: clamp(body.D, 0.18, 0.01, 1),
  }
}

function calculateUap(core: { E: number; I: number; C: number; D: number }) {
  return Math.round((core.E / 100) * (core.I / 100) * (core.C / 100) * (1 - core.D) * 100)
}

function decisionFor(core: { D: number }, uap: number) {
  if (core.D >= 0.7) {
    return { type: 'BLOCK', reason: 'Drift above permitted range.', action: 'hold', confidence: 0.98 }
  }

  if (uap < 60) {
    return { type: 'AUDIT', reason: 'Performance below optimization threshold.', action: 'review', confidence: 0.91 }
  }

  return { type: 'OPTIMIZE', reason: 'Stable operating range.', action: 'optimize', confidence: 0.87 }
}

function policyFor(decision: any) {
  return {
    allowed: decision.type !== 'BLOCK',
    violations: decision.type === 'OPTIMIZE'
      ? []
      : [{
          id: `POLICY-${decision.type}`,
          severity: decision.type === 'BLOCK' ? 'HARD_BLOCK' : 'AUDIT_REQUIRED',
          message: decision.reason,
        }],
    enforcedDecision: decision,
  }
}

function buildSystem(body: any) {
  const core = buildCore(body)
  const uap = calculateUap(core)
  const decision = decisionFor(core, uap)
  return {
    core,
    uap,
    policy: policyFor(decision),
    prediction: {
      driftNext: Number(Math.min(1, Math.max(0.01, core.D + 0.01)).toFixed(2)),
      uapNext: calculateUap({ ...core, D: Math.min(1, core.D + 0.01) }),
      risk: core.D > 0.65 || uap < 35 ? 'HIGH' : core.D > 0.4 || uap < 50 ? 'MEDIUM' : 'LOW',
    },
  }
}

function response(res: any, payload: any) {
  res.setHeader?.('Cache-Control', 'no-store, max-age=0')
  res.setHeader?.('X-Content-Type-Options', 'nosniff')
  return res.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    ...payload,
  })
}

export default function handler(req: any, res: any) {
  try {
    const body = parseBody(req)
    const url = new URL(req.url || '/', 'http://localhost')
    const action = String(url.searchParams.get('action') || body.action || 'recommend')
    const v = Number(url.searchParams.get('v') || body.v || 1)
    const system = buildSystem(body)

    if (action === 'health') {
      return response(res, {
        v,
        service: 'reactor-theory-system-api',
        status: 'ok',
        runtime: 'vercel-serverless',
      })
    }

    if (action === 'core') {
      return response(res, {
        v,
        core: system.core,
        source: 'system:core',
      })
    }

    if (action === 'simulate') {
      const risk = system.prediction.risk
      return response(res, {
        v,
        simulation: {
          scenario: body.scenario || 'baseline',
          risk,
          recommendedAction: risk === 'HIGH' ? 'ESCALATE' : risk === 'MEDIUM' ? 'FORCE_REVIEW' : 'MONITOR',
          nodes: [
            { id: 'Core', trust: 0.95, drift: system.core.D },
            { id: 'Edge-1', trust: 0.82, drift: Math.min(1, system.core.D + 0.04) },
            { id: 'External-A', trust: 0.61, drift: Math.min(1, system.core.D + 0.09) },
          ],
        },
        source: 'system:simulate',
      })
    }

    if (action === 'federation') {
      return response(res, {
        v,
        federation: {
          nodes: [
            { id: 'Core', trust: 0.95, mode: 'PRIMARY' },
            { id: 'Edge-1', trust: 0.82, mode: 'ADVISORY' },
            { id: 'Edge-2', trust: 0.76, mode: 'ADVISORY' },
            { id: 'External-A', trust: 0.61, mode: 'OBSERVE_ONLY' },
          ],
          consensus: system.policy.enforcedDecision.type,
        },
        source: 'system:federation',
      })
    }

    if (action === 'override') {
      return response(res, {
        v,
        override: {
          accepted: true,
          action: body.overrideAction || body.override || 'FORCE_REVIEW',
          reason: body.reason || 'Operator review',
          recordedAt: new Date().toISOString(),
        },
        source: 'system:override',
      })
    }

    if (action === 'report') {
      return response(res, {
        v,
        report: {
          posture: system.prediction.risk === 'HIGH' ? 'WATCH' : 'STABLE',
          kpis: {
            uap: system.uap,
            drift: system.core.D,
            decision: system.policy.enforcedDecision.type,
          },
          audit: {
            exportReady: true,
            traceMode: 'stateless-demo',
          },
        },
        source: 'system:report',
      })
    }

    return response(res, {
      v,
      ...system,
      source: 'system:recommend',
    })
  } catch (err) {
    console.error('system api fallback:', err)
    return res.status(200).json({
      ok: false,
      fallback: true,
      generatedAt: new Date().toISOString(),
      core: { E: 92, I: 88, C: 84, D: 0.18 },
      uap: 56,
      policy: { enforcedDecision: { type: 'AUDIT', reason: 'Server fallback', action: 'review', confidence: 0.5 } },
    })
  }
}
