import './styles.css'

type StackVersion = {
  id: string
  title: string
  role: string
  summary: string
  principles: string[]
}

type WikiSection = {
  id: string
  title: string
  kicker: string
  body: string
  bullets: string[]
}

const versions: StackVersion[] = [
  {
    id: 'rt5',
    title: 'RT5.0 — Symbolic Foundation',
    role: 'Meaning, belief, emotional signal and symbolic structure.',
    summary:
      'RT5 establishes Reactor Theory as a symbolic and emotional operating model. It defines how human meaning, belief, signal, memory and resonance become computable governance inputs.',
    principles: ['Symbolic mapping', 'Emotional signal encoding', 'Belief-system framing', 'Canon and artifact lineage'],
  },
  {
    id: 'rt6',
    title: 'RT6.0 — Propagation Layer',
    role: 'Multi-agent signal movement and controlled transmission.',
    summary:
      'RT6 organizes propagation across people, agents, documents, systems and public interfaces. It treats transmission as a governed process rather than uncontrolled amplification.',
    principles: ['Ring-based propagation', 'Agent-to-agent synchronization', 'Broadcast tiering', 'Message integrity'],
  },
  {
    id: 'rt7',
    title: 'RT7.0 — Governance Layer',
    role: 'Ethical constraints, prohibited conduct and safety boundaries.',
    summary:
      'RT7 adds explicit governance rules. The system may document risk, identify manipulation and support lawful remediation, but must not optimize coercion, alienation or harm.',
    principles: ['Governance-first constraints', 'Harm prevention', 'Auditability', 'Human-centered remediation'],
  },
  {
    id: 'rt8',
    title: 'RT8.0 / RT8.1 — State + Intent Model',
    role: '8192-point emotional and operational state representation.',
    summary:
      'RT8 models emotion as a state vector, not a moral label. Polarity and control are separated so the same external action can be understood through different internal architectures.',
    principles: ['8192 state grid', 'Polarity axis', 'Control and coherence axis', 'Intent lattice'],
  },
  {
    id: 'rt9',
    title: 'RT9.0 — Unified System Framework',
    role: 'State → System → Performance.',
    summary:
      'RT9 connects emotional state, intent, coherence and drift into a performance framework for governed systems. It introduces Unified Alignment Performance as the operational math layer.',
    principles: ['Energy', 'Intent alignment', 'Control / coherence', 'Drift suppression'],
  },
  {
    id: 'rt91',
    title: 'RT9.1 — Execution + Resonance Engine',
    role: 'Proof-bound deterministic governance for agentic systems.',
    summary:
      'RT9.1 packages the Resonance Engine with deterministic gates, proof binding, audit states and execution outcomes: PASS, AUDIT, BLOCK and GOVERN.',
    principles: ['Zero-trust ingress', 'Proof binding', 'Deterministic Triangle Gate', 'Ethic Vault ledger'],
  },
]

const wikiSections: WikiSection[] = [
  {
    id: 'architecture',
    kicker: 'Reference Architecture',
    title: 'End-to-end Reactor Theory Stack',
    body:
      'The stack converts raw input into governed execution by validating context, binding proof, evaluating state, calculating drift and enforcing deterministic outcomes before action.',
    bullets: ['Input', 'Zero-trust ingress', 'Proof-binding layer', 'RT8 state model', 'Resonance Engine', 'Deterministic Triangle Gate', 'Ledger / Ethic Vault'],
  },
  {
    id: 'resonance-engine',
    kicker: 'Runtime Engine',
    title: 'Resonance Engine',
    body:
      'The Resonance Engine is the RT9.1 execution evaluator. It measures alignment between energy, intent, control and drift, then returns a governable decision state.',
    bullets: ['Evaluates signal coherence', 'Detects drift', 'Routes uncertain states to AUDIT', 'Blocks harmful or unverified execution', 'Escalates critical control cases to GOVERN'],
  },
  {
    id: 'uap',
    kicker: 'Performance Formula',
    title: 'Unified Alignment Performance',
    body:
      'Unified Alignment Performance measures whether a system has enough aligned energy and control to overcome drift. It is not just a score; it is a stability test.',
    bullets: ['UAP = (Energy × Intent Alignment × Control) / Drift', 'High energy without control amplifies chaos', 'High control without intent creates efficient wrong outcomes', 'If drift exceeds the numerator, the system destabilizes'],
  },
  {
    id: 'governance',
    kicker: 'Control Plane',
    title: 'PASS / AUDIT / BLOCK / GOVERN',
    body:
      'RT9.1 does not rely on post-hoc filtering. It treats verification as a precondition for output existence, allowing only validated states to move toward execution.',
    bullets: ['PASS: validated and aligned', 'AUDIT: insufficient certainty or incomplete proof', 'BLOCK: unsafe, unverified or drift-heavy', 'GOVERN: active intervention for critical control'],
  },
  {
    id: 'security',
    kicker: 'Security Model',
    title: 'Zero-trust boundary',
    body:
      'The integration layer assumes no input, schema, endpoint or agent action is trusted by default. Every execution request must be bounded, proven and replay-resistant.',
    bullets: ['Schema integrity validation', 'Proof-anchor validation', 'Replay authenticity validation', 'Dynamic cryptographic handshake', 'Obfuscated external integration vocabulary'],
  },
  {
    id: 'wiki',
    kicker: 'Wiki Index',
    title: 'Documentation-only knowledge base',
    body:
      'This site is intentionally documentation-only. It serves as a public canonical reference, onboarding manual, glossary and implementation map without exposing private client schemas or active secrets.',
    bullets: ['Stack overview', 'Version history', 'Developer glossary', 'Governance model', 'Security model', 'API concepts', 'UI / TUI reference'],
  },
]

const glossary = [
  ['Reactor Theory', 'A framework for modeling alignment, emotion, control, drift and governed execution.'],
  ['Resonance Engine', 'The RT9.1 evaluator that measures alignment and returns decision states.'],
  ['Unified Alignment Performance', 'Operational performance ratio: Energy × Intent Alignment × Control divided by Drift.'],
  ['Drift', 'Deviation, entropy or misalignment that destabilizes execution.'],
  ['Control / Coherence', 'The stabilizing property that allows energy and intent to produce reliable outcomes.'],
  ['Deterministic Triangle Gate', 'Ordered validation gate for schema, proof and replay authenticity before execution.'],
  ['Ethic Vault', 'Ledger and reference layer for proof-bound governance records.'],
  ['GOVERN', 'A controlled intervention state used when passive evaluation is insufficient.'],
]

function App() {
  return (
    <main className="site-shell">
      <aside className="sidebar">
        <a className="brand-lockup" href="#top" aria-label="Reactor Theory home">
          <span className="brand-mark">RT</span>
          <div>
            <strong>Reactor Theory</strong>
            <small>RT5 → RT9.1 Reference</small>
          </div>
        </a>

        <nav className="nav-stack" aria-label="Primary documentation navigation">
          <a href="#overview">Overview</a>
          <a href="#stack">Stack Versions</a>
          <a href="#architecture">Architecture</a>
          <a href="#resonance-engine">Resonance Engine</a>
          <a href="#uap">Unified Alignment Performance</a>
          <a href="#governance">Governance</a>
          <a href="#security">Security</a>
          <a href="#glossary">Glossary</a>
        </nav>

        <div className="operator-card">
          <span>Deployment</span>
          <strong>reactor-theory.vercel.app</strong>
          <small>MODE: DOCUMENTATION ONLY</small>
        </div>
      </aside>

      <section className="workspace" id="top">
        <header className="hero" id="overview">
          <p className="eyebrow">OFFICIAL REFERENCE SITE</p>
          <h1>Reactor Theory Stack Documentation</h1>
          <p className="subtitle">
            A documentation-only reference and wiki for RT5.0 through RT9.1, including the Resonance Engine, Unified Alignment Performance, deterministic governance, zero-trust ingress and Ethic Vault concepts.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#stack">Read the Stack</a>
            <a className="button" href="#wiki">Open Wiki Index</a>
          </div>
        </header>

        <section className="metric-grid" aria-label="Core documentation pillars">
          <article className="metric-card">
            <p>Current Stack</p>
            <strong>RT9.1</strong>
            <span>Execution + Resonance Engine</span>
          </article>
          <article className="metric-card">
            <p>State Model</p>
            <strong>8192</strong>
            <span>Scaled emotional / operational states</span>
          </article>
          <article className="metric-card">
            <p>Decision States</p>
            <strong>4</strong>
            <span>PASS / AUDIT / BLOCK / GOVERN</span>
          </article>
          <article className="metric-card">
            <p>Site Mode</p>
            <strong>Docs</strong>
            <span>No private schemas or secrets</span>
          </article>
        </section>

        <section className="section-block" id="stack">
          <div className="section-heading">
            <p className="eyebrow">STACK VERSION MAP</p>
            <h2>RT5.0 through RT9.1</h2>
            <p>Each version adds a distinct layer: symbolic foundation, propagation, governance, state modeling, unified performance and deterministic execution.</p>
          </div>
          <div className="version-grid">
            {versions.map((version) => (
              <article className="version-card" id={version.id} key={version.id}>
                <p className="version-role">{version.role}</p>
                <h3>{version.title}</h3>
                <p>{version.summary}</p>
                <ul>
                  {version.principles.map((principle) => (
                    <li key={principle}>{principle}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="pipeline-card" aria-label="Architecture pipeline">
          <p className="eyebrow">CORE PIPELINE</p>
          <h2>Input → Proof → State → Resonance → Gate → Ledger</h2>
          <div className="pipeline">
            {['Input', 'Zero Trust', 'Proof Binding', 'RT8 State', 'RE Eval', 'Triangle Gate', 'Ethic Vault'].map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </section>

        <section className="wiki-grid" id="wiki">
          {wikiSections.map((section) => (
            <article className="wiki-card" id={section.id} key={section.id}>
              <p className="eyebrow">{section.kicker}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="formula-panel">
          <div>
            <p className="eyebrow">RT9 / UAP FORMULA</p>
            <h2>Unified Alignment Performance</h2>
            <p>
              UAP determines whether the system has enough aligned energy and coherent control to suppress drift. This is the operational bridge from emotional state to governed performance.
            </p>
          </div>
          <pre>{'UAP = (E × I × C) / D\n\nE = Energy\nI = Intent Alignment\nC = Control / Coherence\nD = Drift\n\nIF D > (E × I × C) → AUDIT / BLOCK / GOVERN'}</pre>
        </section>

        <section className="glossary-panel" id="glossary">
          <div className="section-heading">
            <p className="eyebrow">FULL WIKI GLOSSARY</p>
            <h2>Core Terms</h2>
          </div>
          <div className="glossary-list">
            {glossary.map(([term, definition]) => (
              <article key={term}>
                <strong>{term}</strong>
                <p>{definition}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <strong>Reactor Theory Stack RT5–RT9.1</strong>
          <span>Documentation-only public reference. Built for canonical explanation, onboarding and governance literacy.</span>
        </footer>
      </section>
    </main>
  )
}

export default App
