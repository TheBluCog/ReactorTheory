const chuckLinks = [
  ['Health', '/api/chuck?action=health'],
  ['Patterns', '/api/chuck?action=patterns'],
  ['Schemas', '/api/chuck?action=schemas'],
  ['Classify', '/api/chuck?action=classify&text=Repeated%20court%20motions%20and%20custody%20threats'],
  ['Workspace Schema', '/chuck-workspace-schema.json'],
  ['Spec', '/AGENT_CHUCK.md'],
];

const states = [
  ['ALLOW', 'safe documentation'],
  ['HOLD', 'counsel review'],
  ['BLOCK', 'no escalation'],
  ['PROOF', 'evidence first'],
];

export default function App() {
  return (
    <main className="chuck-root">
      <section className="chuck-shell">
        <header className="chuck-hero">
          <div className="chuck-topline">
            <span className="chuck-mark">AC</span>
            <span className="chuck-live">AGENT CHUCK LIVE</span>
          </div>
          <p className="chuck-kicker">RT11 / ARTYMUS / ETHIC VAULT</p>
          <h1>Agent Chuck</h1>
          <p className="chuck-tagline">Operational calm wins. Evidence moves. Noise dies.</p>
          <p className="chuck-copy">A governed evidence-control surface for high-conflict, coercive-control, litigation-abuse, and counsel-safe documentation workflows.</p>
        </header>

        <section className="chuck-state-grid">
          {states.map(([label, sub]) => (
            <div className="chuck-state" key={label}>
              <b>{label}</b>
              <span>{sub}</span>
            </div>
          ))}
        </section>

        <section className="chuck-panel-grid">
          <article className="chuck-panel primary">
            <h2>Mission</h2>
            <p>Chuck converts narrative chaos into structured records, pattern screens, evidence packets, and lawyer-ready summaries. He does not threaten, publish, contact, retaliate, or replace counsel.</p>
          </article>

          <article className="chuck-panel">
            <h2>Control Flow</h2>
            <pre>state -&gt; proof -&gt; control -&gt; audit -&gt; verification</pre>
          </article>

          <article className="chuck-panel">
            <h2>Core API</h2>
            <div className="chuck-links">
              {chuckLinks.map(([label, href]) => (
                <a href={href} key={href}>{label}</a>
              ))}
            </div>
          </article>

          <article className="chuck-panel">
            <h2>Guardrails</h2>
            <ul>
              <li>No confrontation.</li>
              <li>No threats.</li>
              <li>No unauthorized publication.</li>
              <li>No contact escalation.</li>
              <li>No legal conclusion without counsel.</li>
            </ul>
          </article>
        </section>

        <section className="chuck-command">
          <h2>Operator Posture</h2>
          <pre>{JSON.stringify({
            service: 'AGENT-CHUCK',
            version: '1.0.0',
            mode: 'advisory/evidence-control',
            posture: 'HOLD_WHEN_UNSURE',
            execution_authority: 'NONE',
            default_action: 'DOCUMENT_AND_REVIEW'
          }, null, 2)}</pre>
        </section>
      </section>
    </main>
  );
}
