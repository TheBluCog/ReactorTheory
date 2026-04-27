import { useSystem } from './features/system/useSystem'
import HUDPanel from './components/hud/HUDPanel'
import OperatorConsole from './components/hud/OperatorConsole'
import FederationPanel from './components/hud/FederationPanel'

export default function App() {
  const { uap, decision, drift, core, error, history, prediction } = useSystem()

  return (
    <main style={{ padding: 20 }}>
      <HUDPanel
        uap={uap}
        decision={decision}
        drift={drift}
        error={error}
      />

      <OperatorConsole />

      <FederationPanel />

      <div className="hud-panel">
        <h3>Predictive Risk</h3>
        <p>Next Drift: {Math.round(prediction.driftNext * 100)}%</p>
        <p>Projected UAP: {prediction.uapNext}</p>
        <p>Risk: {prediction.risk}</p>
      </div>

      <div className="hud-panel">
        <h3>Recent Alerts</h3>
        {history?.filter((h: any) => h.anomaly).slice(-5).map((a: any, i: number) => (
          <div key={i} style={{ color: '#ff4d4d' }}>
            ⚠ Drift spike at {new Date(a.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>

    </main>
  )
}
