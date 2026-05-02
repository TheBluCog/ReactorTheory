export default function RT11Landing() {
  return <section className="rt11-landing" id="rt11-landing">
    <header className="hero investor-hero">
      <p className="eyebrow">REACTOR THEORY / ETHIC VAULT / RT11</p>
      <h1>Programmable trust infrastructure for AI governance, contribution economics, and dynamic UBI.</h1>
      <p className="subtitle">RT11 converts coherent human and machine contribution into measurable value using UAP, Resonance, Cred‑NFT reputation, and auditable treasury routing.</p>
      <div className="hero-actions">
        <a className="button primary" href="#rt11">Open Live Dashboard</a>
        <a className="button" href="https://github.com/TheBluCog/ReactorTheory" target="_blank" rel="noreferrer">View GitHub</a>
        <a className="button" href="#rt11-partner">Partner / Invest</a>
      </div>
      <div className="hero-proof"><span>Math</span><span>Simulation</span><span>UI</span><span>Contracts</span><span>Deploy Pipeline</span></div>
    </header>

    <section className="metric-grid">
      <article className="metric-card"><p>Stack</p><strong>4</strong><span>layers connected</span></article>
      <article className="metric-card"><p>Contracts</p><strong>3</strong><span>scaffolded</span></article>
      <article className="metric-card"><p>Treasury</p><strong>80/20</strong><span>routing model</span></article>
      <article className="metric-card"><p>Network</p><strong>Polygon</strong><span>settlement path</span></article>
    </section>

    <section className="about-panel">
      <p className="eyebrow">WHY NOW</p>
      <h2>Autonomous systems are moving faster than governance can audit.</h2>
      <p>Markets reward extraction and velocity. RT11 rewards trust, coherent contribution, entropy reduction, and durable public-good creation.</p>
      <div className="about-grid">
        <article className="glass-card"><h3>Problem</h3><p>Current systems optimize output after the fact.</p></article>
        <article className="glass-card"><h3>Control Layer</h3><p>RT11 makes alignment measurable before capital moves.</p></article>
        <article className="glass-card"><h3>Economic Primitive</h3><p>Contribution, reputation, and treasury routing become programmable.</p></article>
      </div>
    </section>

    <section className="investor-panel">
      <p className="eyebrow">PRODUCT MODULES</p>
      <h2>From math to usable infrastructure.</h2>
      <div className="pitch-grid">
        {['UAP API — score Energy, Intent, Control, and Drift.','Resonance Engine — measure downstream network impact.','Cred‑NFT — persist portable contribution and reputation state.','Treasury Router — route baseline + weighted payouts.','Chain Status — expose Polygon provenance and deployment state.','SaaS Funnel — convert pilots, investors, and partners.'].map((x,i)=><article className="pitch-card glass-card" key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></article>)}
      </div>
    </section>

    <section className="formula-panel">
      <div><p className="eyebrow">CORE MATH</p><h2>Value is not raw activity. Value is coherent contribution.</h2></div>
      <pre>UAP = (E × I × C) / D{`\n\n`}R = ((E × I × C) × NetworkImpact) / (Drift × Entropy){`\n\n`}Civilization Stability = (Trust × Cooperation × Alignment) / Entropy</pre>
    </section>

    <section className="about-panel" id="rt11-partner">
      <p className="eyebrow">INVESTOR / PARTNER ASK</p>
      <h2>Seeking pilot partners for testnet validation and enterprise governance pilots.</h2>
      <p>RT11 is ready for technical validation, product pilots, and strategic partnerships in AI governance, treasury automation, and contribution-based public-good economics.</p>
      <div className="hero-actions">
        <a className="button primary" href="#rt11">Demo RT11 Dashboard</a>
        <a className="button" href="https://github.com/TheBluCog/ReactorTheory/issues/1" target="_blank" rel="noreferrer">View Milestone</a>
        <a className="button" href="https://polygonscan.com/tx/0x9971c17e2d9638cbb63a2d2670db69fa4f335a8a98b222777a3838acf0b2b3e8" target="_blank" rel="noreferrer">Polygon Anchor</a>
      </div>
    </section>
  </section>
}
