import { useEffect, useMemo, useState } from 'react'
import { fetchSystem, SystemResponse, DecisionType } from '../../lib/api'

type SystemFrame = {
  timestamp: number
  uap: number
  decision: DecisionType
  drift: number
  core: SystemResponse['core']
  anomaly: boolean
}

type SystemState = {
  uap: number
  decision: DecisionType
  drift: number
  core: SystemResponse['core'] | null
  history: SystemFrame[]
  error: string | null
}

function predictRisk(history: SystemFrame[]) {
  if (history.length < 3) {
    return { driftNext: 0, uapNext: 0, risk: 'WARMING_UP' as const }
  }

  const recent = history.slice(-5)
  const first = recent[0]
  const last = recent[recent.length - 1]
  const driftVelocity = (last.drift - first.drift) / Math.max(1, recent.length - 1)
  const driftNext = Math.max(0.01, Math.min(1, last.drift + driftVelocity))
  const uapNext = Math.round((last.core.E / 100) * (last.core.I / 100) * (last.core.C / 100) * (1 - driftNext) * 100)

  let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  if (driftNext > 0.65 || uapNext < 35) risk = 'HIGH'
  else if (driftNext > 0.4 || uapNext < 50 || driftVelocity > 0.04) risk = 'MEDIUM'

  return {
    driftNext: Number(driftNext.toFixed(2)),
    uapNext,
    risk,
  }
}

export function useSystem(pollMs = 3000) {
  const [state, setState] = useState<SystemState>({
    uap: 0,
    decision: 'WAITING',
    drift: 0,
    core: null,
    history: [],
    error: null,
  })

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await fetchSystem()
        if (!active) return

        const frame: SystemFrame = {
          timestamp: Date.now(),
          uap: data.uap,
          decision: data.policy?.enforcedDecision?.type ?? 'UNKNOWN',
          drift: data.core?.D ?? 0,
          core: data.core,
          anomaly: (data.core?.D ?? 0) > 0.7 || data.policy?.enforcedDecision?.type === 'BLOCK',
        }

        setState((prev) => ({
          uap: frame.uap,
          decision: frame.decision,
          drift: frame.drift,
          core: frame.core,
          history: [...prev.history.slice(-59), frame],
          error: null,
        }))
      } catch (err) {
        if (!active) return
        setState((prev) => ({ ...prev, error: 'API connection failed' }))
      }
    }

    load()
    const id = setInterval(load, pollMs)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [pollMs])

  const prediction = useMemo(() => predictRisk(state.history), [state.history])

  return { ...state, prediction }
}
