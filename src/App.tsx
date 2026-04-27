import { useEffect, useState } from 'react'

export default function App() {
  const [uap, setUap] = useState(0)
  const [decision, setDecision] = useState('WAITING')
  const [drift, setDrift] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const res = await fetch('/api/system?action=recommend')
      const data = await res.json()

      if (!data || data.fallback) throw new Error()

      setUap(data.uap)
      setDecision(data.policy?.enforcedDecision?.type || 'UNKNOWN')
      setDrift(data.core?.D || 0)
      setError(null)
    } catch {
      setError('API connection failed')
    }
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 3000)
    return () => clearInterval(i)
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1>ReactorCore</h1>
      <p>AI Governance Control Plane</p>

      <h2>UAP: {uap}</h2>
      <h3>{decision}</h3>
      <p>Drift: {Math.round(drift * 100)}%</p>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </main>
  )
}