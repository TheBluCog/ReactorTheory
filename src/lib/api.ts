export type DecisionType = 'WAITING' | 'OPTIMIZE' | 'AUDIT' | 'BLOCK' | 'UNKNOWN'

export async function fetchSystem() {
  const res = await fetch('/api/system') // ✅ FIXED (GET, no params)

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const data = await res.json()

  if (!data || data.fallback) {
    throw new Error('Fallback response')
  }

  return data
}