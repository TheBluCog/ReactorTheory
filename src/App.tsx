import { useSystem } from './features/system/useSystem'
import HUDPanel from './components/hud/HUDPanel'

export default function App() {
  const { uap, decision, drift, error } = useSystem()

  return (
    <main style={{ padding: 20 }}>
      <HUDPanel
        uap={uap}
        decision={decision}
        drift={drift}
        error={error}
      />
    </main>
  )
}
