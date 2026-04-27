export type DecisionType = 'WAITING' | 'OPTIMIZE' | 'AUDIT' | 'BLOCK' | 'UNKNOWN'

export type CoreState = {
  E: number
  I: number
  C: number
  D: number
}

export type SystemResponse = {
  ok: boolean
  fallback?: boolean
  core: CoreState
  uap: number
  policy: {
    enforcedDecision: {
      type: DecisionType
      reason?: string
      action?: string
      confidence?: number
    }
  }
  source?: string
}

export async function fetchSystem(): Promise<SystemResponse> {
  const response = await fetch('/api/system?action=recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`System API failed: ${response.status}`)
  }

  const data = (await response.json()) as SystemResponse

  if (!data || data.fallback || !data.core || typeof data.uap !== 'number') {
    throw new Error('System API returned degraded payload')
  }

  return data
}
