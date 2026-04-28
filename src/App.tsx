import './styles.css'

type Version = {
  id: string
  name: string
  layer: string
  summary: string
  bullets: string[]
}

type Topic = {
  id: string
  label: string
  title: string
  body: string
  bullets: string[]
}

const versions: Version[] = [
  {
    id: 'rt5',
    name: 'RT5.0 — Symbolic Foundation',
    layer: 'Meaning, emotional signal, belief structure, and canonical artifacts.',
    summary:
      'RT5 defines the symbolic foundation of Reactor Theory: how meaning, emotion, intent, memory, belief, and canon become structured inputs for analysis and governance.',
    bullets: ['Symbolic mapping', 'Emotional signal encoding', 'Belief-system framing', 'Canonical artifact lineage'],
  },
  {
    id: 'rt6',
    name: 'RT6.0 — Propagation Layer',
    layer: 'Controlled transmission across people, agents, documents, and systems.',
    summary:
      'RT6 treats propagation as a governed process. It organizes how signals move between rings, agents, systems, public interfaces, and institutional contexts.',
    bullets: ['Ring architecture', 'Agent-to-agent synchronization', 'Broadcast tiering', 'Message integrity'],
  },
  {
    id: 'rt7',
    name: 'RT7.0 — Governance Layer',
    layer: 'Ethics, prohibited conduct, constraints, and remediation boundaries.',
    summary:
      'RT7 establishes governance rules and explicit boundaries. It supports documentation, protection, repair, and lawful remediation while rejecting coercive or harmful optimization.',
    bullets: ['Governance-first constraints', 'Harm prevention', 'Auditability', 'Human-centered remediation'],
  },
  {
    id: 'rt8',
    name: 'RT8.0 / RT8.1 — State + Intent Model',
    layer: '8192-point emotional and operational state representation.',
    summary:
      'RT8 models emotion as a state vector, not a moral label. Polarity, control, coherence, arousal, and intent are separated so outcomes can be analyzed by internal architecture.',
    bullets: ['8192 state grid', 'Blue ↔ orange polarity axis', 'Control / coherence axis', 'Intent lattice'],
  },
  {
    id: 'rt9',
    name: 'RT9.0 — Unified System Framework',
    layer: 'State → System → Performance.',
    summary:
      'RT9 connects emotional state, intent, control, coherence, drift, and execution into a unified performance model for governed systems.',
    bullets: ['Unified Alignment Performance', 'Drift suppression', 'State-to-system mapping', 'Performance dynamics'],
  },
  {
    id: 'rt91',
    name: 'RT9.1 — Resonance Engine Reference',
    layer: 'Documentation reference for proof-bound deterministic governance.',
    summary:
      'RT9.1 documents the execution vocabulary: Resonance Engine, Deterministic Triangle Gate, zero-trust ingress, proof binding, and PASS / AUDIT / BLOCK / GOVERN outcomes.',
    bullets: ['Resonance Engine', 'Deterministic Triangle Gate', 'Zero-trust boundary', 'Ethic Vault ledger model'],
  },
]

const topics: Topic[] = [
  {
    id: 'architecture',
    label: 'Reference Architecture',
    title: 'End-to-end stack map',
    body:
      'The reference stack describes how input is framed, validated, modeled, evaluated, and documented. ReactorTheory is documentation-only: it explains the model without exposing private schemas, secrets, or operational endpoints.',
    bullets: ['Input framing', 'Zero-trust ingress concept', 'Proof-binding layer', 'RT8 state model', 'Resonance Engine reference', 'Deterministic Triangle Gate', 'Ledger / Ethic Vault concept'],
  },
  {
    id: 'uap',
    label: 'Performance Formula',
    title: 'Unified Alignment Performance',
    body:
      'Unified Alignment Performance is the operational bridge from state to performance. It measures whether aligned energy and coherent control are strong enough to overcome drift.',
    bullets: ['UAP = (Energy × Intent Alignment × Control) / Drift', 'High energy without control amplifies chaos', 'High control without intent produces efficient wrong outcomes', 'If drift exceeds aligned capacity, the system destabilizes'],
  },
  {
    id: 'resonance-engine',
    label: 'Runtime Concept',
    title: 'Resonance Engine',
    body:
      'The Resonance Engine is documented here as the RT9.1 evaluator concept. It scores alignment between signal, intent, control, context, and drift before a system moves toward an action state.',
    bullets: ['Evaluates signal coherence', 'Detects drift', 'Routes uncertain states to AUDIT', 'Blocks unsafe or unverified states', 'Escalates critical control states to GOVERN'],
  },
  {
    id: 'governance',
    label: 'Control Vocabulary',
    title: 'PASS / AUDIT / BLOCK / GOVERN',
    body:
      'RT9.1 governance vocabulary separates validated operation from uncertainty, unsafe states, and critical control interventions.',
    bullets: ['PASS: validated and aligned', 'AUDIT: uncertain or incomplete proof', 'BLOCK: unsafe, unverified, or high-drift', 'GOVERN: controlled intervention for critical states'],
  },
  {
    id: 'security',
    label: 'Security Model',
    title: 'Zero-trust documentation boundary',
    body:
      'This reference site intentionally avoids publishing active client schemas, secrets, private endpoints, or live operational keys. It documents the architecture while preserving deployment safety.',
    bullets: ['No secrets', 'No private client schemas', 'No wallet or chain write UI', 'No runtime control surface', 'Public education and reference only'],
  },
  {
    id: 'wiki',
    label: 'Wiki Index',
    title: 'Documentation knowledge base',
    body:
      'The wiki structure gives readers a stable entry point into Reactor Theory versions, terms, formulas, architecture, governance, and implementation vocabulary.',
    bullets: ['Version map', 'Architecture glossary', 'Formula reference', 'Governance reference', 'Security notes', 'Implementation concepts'],
  },
]

const glossary = [
  ['Reactor Theory', 'A framework for modeling alignment, emotion, intent, control, drift, and governed execution.'],
  ['Unified Alignment Performance', 'The performance ratio formed by Energy, Intent Alignment, Control, and Drift.'],
  ['Drift', 'Entropy, deviation, or misalignment that destabilizes execution.'],
  ['Control / Coherence', 'The stabilizing factor that turns energy and intent into reliable output.'],
  ['Resonance Engine', 'The RT9.1 evaluator concept for alignment, signal coherence, and drift.'],
  ['Deterministic Triangle Gate', 'A final validation concept for schema integrity, proof authenticity, and replay safety.'],
  ['Ethic Vault', 'The ledger/reference concept for proof-bound governance records.'],
  ['GOVERN', 'A controlled intervention state used when passive analysis is insufficient.'],
]

export default function App() {
  return (
    <main className="site-shell">
      <aside className="sidebar">
        <a className="brand-lockup" href="#top" aria-label="Reactor Theory reference home">
          <span className="brand-mark">RT</span>
          <div>
            <strong>Reactor Theory</strong>
            <small>RT5 → RT9.1 Docs</small>
          </div>
        </a>

        <nav className="nav-stack" aria-label="Reference navigation">
          <a href="#overview">Overview</a>
          <a href="#stack">Stack Versions</a>
          <a href="#architecture">Architecture</a>
          <a href="#uap">Unified Alignment Performance</a>
          <a href="#resonance-engine">Resonance Engine</a>
          <a href="#governance">Governance</a>
          <a href="#security">Security</a>
          <a href="#glossary">Glossary</a>
        </nav>

        <div className="operator-card">
          <span>Site Mode</span>
          <strong>Documentation Only</strong>
          <small>No live control plane. No private runtime exposure.</small>
        </div>
      </aside>

      <section className="workspace" id="top">
        <header className="hero" id="overview">
          <p className="eyebrow">OFFICIAL REFERENCE SITE</p>
          <h1>Reactor Theory Stack Documentation</h1>
          <p className="subtitle">
            Public documentation and wiki reference for RT5.0 through RT9.1, including symbolic foundations, propagation, governance, state modeling, Unified Alignment Performance, and the Resonance Engine vocabulary.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#stack">Read the Stack</a>
            <a className="button" href="#wiki">Open Wiki Index</a>
          </div>
        </header>

        <section className="metric-grid" aria-label="Documentation pillars">
          <article className="metric-card"><p>Current Reference</p><strong>RT9.1</strong><span>Resonance Engine vocabulary</span></article>
          <article className="metric-card"><p>State Model</p><strong>8192</strong><span>RT8 emotional / operational grid</span></article>
          <article className="metric-card"><p>Decision Terms</p><strong>4</strong><span>PASS / AUDIT / BLOCK / GOVERN</span></article>
          <article className="metric-card"><p>Boundary</p><strong>Docs</strong><span>No secrets or runtime controls</span></article>
        </section>

        <section className="section-block" id="stack">
          <div className="section-heading">
            <p className="eyebrow">STACK VERSION MAP</p>
            <h2>RT5.0 through RT9.1</h2>
            <p>Each version adds a distinct conceptual layer: symbolic foundation, propagation, governance, state modeling, performance dynamics, and deterministic governance reference.</p>
          </div>
          <div className="version-grid">
            {versions.map((version) => (
              <article className="version-card" id={version.id} key={version.id}>
                <p className="version-role">{version.layer}</p>
                <h3>{version.name}</h3>
                <p>{version.summary}</p>
                <ul>{version.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="pipeline-card" aria-label="Reference pipeline">
          <p className="eyebrow">REFERENCE PIPELINE</p>
          <h2>Input → Proof → State → Resonance → Gate → Record</h2>
          <div className="pipeline">
            {['Input', 'Zero Trust', 'Proof Binding', 'RT8 State', 'Resonance', 'Triangle Gate', 'Ethic Vault'].map((step) => <span key={step}>{step}</span>)}
          </div>
        </section>

        <section className="wiki-grid" id="wiki">
          {topics.map((topic) => (
            <article className="wiki-card" id={topic.id} key={topic.id}>
              <p className="eyebrow">{topic.label}</p>
              <h2>{topic.title}</h2>
              <p>{topic.body}</p>
              <ul>{topic.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </section>

        <section className="formula-panel">
          <div>
            <p className="eyebrow">RT9 FORMULA</p>
            <h2>Unified Alignment Performance</h2>
            <p>UAP links energy, intent alignment, control, and drift into a single operational performance concept.</p>
          </div>
          <pre>{'UAP = (E × I × C) / D\n\nE = Energy\nI = Intent Alignment\nC = Control / Coherence\nD = Drift\n\nIf D > (E × I × C), the system enters AUDIT, BLOCK, or GOVERN.'}</pre>
        </section>

        <section className="glossary-panel" id="glossary">
          <div className="section-heading">
            <p className="eyebrow">WIKI GLOSSARY</p>
            <h2>Core Terms</h2>
          </div>
          <div className="glossary-list">
            {glossary.map(([term, definition]) => (
              <article key={term}><strong>{term}</strong><p>{definition}</p></article>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <strong>Reactor Theory Stack RT5–RT9.1</strong>
          <span>Public reference site. Documentation only. Built for explanation, onboarding, and governance literacy.</span>
        </footer>
      </section>
    </main>
  )
}
