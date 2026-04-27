import React from 'react'
import { DecisionType } from '../../lib/api'

type Props = {
  uap: number
  decision: DecisionType
  drift: number
  error?: string | null
}

function decisionColor(type: DecisionType) {
  switch (type) {
    case 'BLOCK': return '#ff4d4d'
    case 'AUDIT': return '#ffd166'
    case 'OPTIMIZE': return '#4dffb3'
    default: return '#4da3ff'
  }
}

export default function HUDPanel({ uap, decision, drift, error }: Props) {
  const color = decisionColor(decision)

  return (
    <section style={{
      marginTop: 20,
      padding: 16,
      border: '1px solid #1f2a44',
      borderRadius: 12,
      background: 'rgba(6,10,18,0.85)'
    }}>
      <h1 style={{ margin: 0 }}>ReactorCore</h1>
      <p style={{ marginTop: 4, color: '#7c8aa5' }}>AI Governance Control Plane</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <div>
          <small>UAP</small>
          <div style={{ fontSize: 28 }}>{uap}</div>
        </div>

        <div>
          <small>DRIFT</small>
          <div style={{ fontSize: 28 }}>{Math.round(drift * 100)}%</div>
        </div>

        <div>
          <small>DECISION</small>
          <div style={{ fontSize: 28, color }}>{decision}</div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 10, color: '#ff6b6b' }}>
          {error}
        </div>
      )}
    </section>
  )
}
