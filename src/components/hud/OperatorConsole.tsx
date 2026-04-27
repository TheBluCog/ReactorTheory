import { useState } from 'react'

export type OverrideAction = 'RESUME' | 'PAUSE' | 'FORCE_REVIEW' | 'ESCALATE' | 'LOCKDOWN'

type OverrideEvent = {
  time: string
  action: OverrideAction
  reason: string
}

type Props = {
  onOverride?: (event: OverrideEvent) => void
}

export default function OperatorConsole({ onOverride }: Props) {
  const [reason, setReason] = useState('Operator review')
  const [lastAction, setLastAction] = useState<OverrideEvent | null>(null)

  function trigger(action: OverrideAction) {
    const event = {
      time: new Date().toLocaleTimeString(),
      action,
      reason: reason.trim() || 'Operator review',
    }

    setLastAction(event)
    onOverride?.(event)
  }

  return (
    <section className="hud-panel">
      <h3>Operator Console</h3>
      <p>Manual override controls for supervised governance.</p>

      <input
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Override reason"
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div className="hud-button-row">
        <button onClick={() => trigger('RESUME')}>Resume</button>
        <button onClick={() => trigger('PAUSE')}>Pause</button>
        <button onClick={() => trigger('FORCE_REVIEW')}>Force Review</button>
        <button onClick={() => trigger('ESCALATE')}>Escalate</button>
        <button onClick={() => trigger('LOCKDOWN')}>Lockdown</button>
      </div>

      {lastAction && (
        <p>
          Last override: <strong>{lastAction.action}</strong> at {lastAction.time}
        </p>
      )}
    </section>
  )
}
