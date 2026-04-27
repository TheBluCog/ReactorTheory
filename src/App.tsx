import { useEffect, useState } from 'react'

export default function App() {
  const [uap, setUap] = useState(0)
  const [decision, setDecision] = useState('WAITING')
  const [drift, setDrift] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/system?action=recommend')
        const data = await res.json()

        setUap(data.uap || 0)
        setDecision(data.policy?.enforcedDecision?.type || 'UNKNOWN')
        setDrift(data.core?.D || 0)
      } catch {
        // silent fail for now
      }
    }

    load()
    const i = setInterval(load, 3000)
    return () => clearInterval(i)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>ReactorCore</h1>
      <h2>UAP: {uap}</h2>
      <h3>{decision}</h3>
      <p>Drift: {Math.round(drift * 100)}%</p>
    </div>
  )
}