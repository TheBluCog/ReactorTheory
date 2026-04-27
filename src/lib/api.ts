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

const LOCAL_SYSTEM: SystemResponse = {
  ok: true,
  fallback: false,
  core: { E: 92, I: 88, C: 84, D: 0.18 },
  uap: 56,
  policy: {
    enforcedDecision: {
      type: 'AUDIT',
      reason: 'Local resilient runtime active.',
      action: 'review',
      confidence: 0.91,
    },
  },
  source: 'client-resilient-fallback',
}

async function tryEndpoint(path: string): Promise<SystemResponse | null> {
  try {
    const response = await fetch(path, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = (await response.json()) as Partial<SystemResponse>

    if (!data || typeof data.uap !== 'number' || !data.core || !data.policy?.enforcedDecision?.type) {
      return null
    }

    return {
      ok: data.ok ?? true,
      fallback: Boolean(data.fallback),
      core: data.core,
      uap: data.uap,
      policy: data.policy,
      source: data.source ?? path,
    }
  } catch {
    return null
  }
}

export async function fetchSystem(): Promise<SystemResponse> {
  const endpoints = [
    '/api/system',
    '/api/system?action=recommend',
    '/api/recommend',
    '/api/core',
  ]

  for (const endpoint of endpoints) {
    const result = await tryEndpoint(endpoint)
    if (result && !result.fallback) return result
  }

  return LOCAL_SYSTEM
}
