export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const input = req.method === 'POST' ? req.body || {} : req.query || {}
  const E = Number(input.E ?? input.energy ?? 7)
  const I = Number(input.I ?? input.intent ?? 0.9)
  const C = Number(input.C ?? input.control ?? 0.85)
  const D = Math.max(Number(input.D ?? input.drift ?? 0.5), 0.0001)
  const impact = Number(input.impact ?? input.networkImpact ?? 1.5)
  const entropy = Math.max(Number(input.entropy ?? 0.6), 0.0001)

  const uap = (E * I * C) / D
  const resonance = ((E * I * C) * impact) / (D * entropy)
  const result = D > 1 ? 'reduced' : resonance > 20 ? 'high_reward' : resonance > 8 ? 'rewarded' : 'review'

  return res.status(200).json({
    ok: true,
    route: '/api/score',
    input: { E, I, C, D, impact, entropy },
    output: {
      uap: Number(uap.toFixed(4)),
      resonance: Number(resonance.toFixed(4)),
      result,
      explanation: 'Higher usefulness, good purpose, quality control, and lower risk increase reward weight.'
    }
  })
}
