type Node = {
  id: string
  trust: number
}

export default function FederationPanel() {
  const nodes: Node[] = [
    { id: 'Core', trust: 0.95 },
    { id: 'Edge-1', trust: 0.82 },
    { id: 'Edge-2', trust: 0.76 },
    { id: 'External-A', trust: 0.61 },
  ]

  return (
    <section className="hud-panel">
      <h3>Federation Topology</h3>
      <p>Multi-tenant trust-weighted node view.</p>

      {nodes.map((node) => (
        <div key={node.id} style={{ marginTop: 6 }}>
          {node.id}: <strong>{Math.round(node.trust * 100)}%</strong>
        </div>
      ))}
    </section>
  )
}
