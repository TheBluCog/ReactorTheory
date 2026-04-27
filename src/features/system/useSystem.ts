import { useEffect, useState } from 'react'
import { fetchSystem, SystemResponse, DecisionType } from '../../lib/api'

type SystemState = {
  uap: number
  decision: DecisionType
  drift: number
  core: SystemResponse['core'] | null
  error: string | null
}

export function useSystem(pollMs = 3000): SystemState {
  const [state, setState] = useState<SystemState>({
    uap: 0,
    decision: 'WAITING',
    drift: 0,
    core: null,
    error: null,
  })

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await fetchSystem()
        if (!active) return

        setState({
          uap: data.uap,
          decision: data.policy?.enforcedDecision?.type ?? 'UNKNOWN',
          drift: data.core?.D ?? 0,
          core: data.core,
          error: null,
        })
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

  return state
}
