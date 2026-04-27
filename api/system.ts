export default function handler(req, res) {
  try {
    const core = { E: 92, I: 88, C: 84, D: 0.18 }

    const uap = Math.round(
      (core.E / 100) *
      (core.I / 100) *
      (core.C / 100) *
      (1 - core.D) *
      100
    )

    const decision = core.D >= 0.7
      ? { type: 'BLOCK', reason: 'High drift' }
      : uap < 60
      ? { type: 'AUDIT', reason: 'Low performance' }
      : { type: 'OPTIMIZE', reason: 'Stable' }

    return res.status(200).json({
      ok: true,
      core,
      uap,
      policy: { enforcedDecision: decision }
    })

  } catch (err) {
    return res.status(200).json({
      ok: false,
      fallback: true,
      core: { E: 50, I: 50, C: 50, D: 0.2 },
      uap: 20,
      policy: { enforcedDecision: { type: 'AUDIT' } }
    })
  }
}
