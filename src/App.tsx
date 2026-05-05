import { useState } from 'react';

type TabKey = 'overview' | 'artymus' | 'rt11' | 'ethic' | 'shauna' | 'spirit' | 'api';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'artymus', label: 'ARTYMUS' },
  { key: 'rt11', label: 'RT11' },
  { key: 'ethic', label: 'Ethic Vault' },
  { key: 'shauna', label: 'Shauna / Maybe' },
  { key: 'spirit', label: 'LetsBuySpirit' },
  { key: 'api', label: 'API' },
];

const cards = {
  overview: {
    eyebrow: 'REACTOR THEORY COMMAND CENTER',
    title: 'Governance-first AI infrastructure.',
    body: 'A compact control-room view for Reactor Theory: ARTYMUS as the operator layer, RT11 as the contribution economy, Ethic Vault as the proof plane, and LetsBuySpirit as the public participation rail.',
    bullets: ['Less scrolling', 'Tabbed sections', 'Mobile-first', 'Proof links visible'],
  },
  artymus: {
    eyebrow: 'ARTYMUS OPERATOR SYSTEM',
    title: 'See the machine. Steer the machine.',
    body: 'ARTYMUS is the operator interface for governed intelligence. It exposes command state, runtime checks, decision posture, agent routing, proof status, and human-in-the-loop execution controls.',
    bullets: ['Control Room', 'Command Layer', 'Runtime Memory', 'Agent Registry', 'Proof Console', 'Governance Loop'],
  },
  rt11: {
    eyebrow: 'SAFE AI INCOME SYSTEM',
    title: 'Make money with AI — without doing shady shit.',
    body: 'RT11 rewards useful AI work: teaching, building, summarizing, reviewing, reducing risk, and improving outcomes. Spam, scams, fake content, and manipulation are penalized.',
    bullets: ['Contribution Score', 'Payout Weight', 'Risk Penalty', 'Proof Record', 'Testnet Next'],
  },
  ethic: {
    eyebrow: 'ETHIC VAULT STACK',
    title: 'Governance in the execution path.',
    body: 'Ethic Vault anchors values as constraints, translates policy into executable boundaries, governs runtime action, records memory, verifies proof, and observes drift.',
    bullets: ['Belief Anchor', 'Policy Engine', 'Runtime Governor', 'Decision Layer', 'Audit Memory', 'Verification', 'Observability'],
  },
  shauna: {
    eyebrow: 'ARTYMUS / SHAUNA LEE LANGE / MAYBE',
    title: 'Mechanism visible. Execution available.',
    body: 'Reference package for Shauna: luxury art consultancy surface, private operator access, valuation coherence, relationship mapping, execution pathways, and RT11 scoring for professional art advisory.',
    bullets: ['Maybe Art Consultancy', 'Operator Dashboard', 'Valuation Layer', 'Mapping Layer', 'Execution Layer', 'Private / Personal / Precise'],
  },
  spirit: {
    eyebrow: 'LETSBUYSPIRIT PUBLISHED PLAN',
    title: 'A public rail for contribution and participation.',
    body: 'LetsBuySpirit organizes attention, capital, contribution, proof, and governance into a clear path: buy in, verify, contribute, reward, and keep the mechanism visible.',
    bullets: ['Buy In', 'Verify', 'Contribute', 'Reward', 'Governance Visible'],
  },
  api: {
    eyebrow: 'JSON PROOF ENDPOINTS',
    title: 'Click should show JSON.',
    body: 'These endpoints are proof checks for the deployed ARTYMUS API. They should render raw JSON, not the front-end shell.',
    bullets: ['Root', 'Health', 'Links'],
  },
};

const apiLinks = [
  'https://reactor-theory.vercel.app/api/artymus',
  'https://reactor-theory.vercel.app/api/artymus?action=health',
  'https://reactor-theory.vercel.app/api/artymus?action=links',
];

function CopyLink({ href }: { href: string }) {
  return (
    <div className="linkbox">
      <code>{href}</code>
      <a href={href}>Open in external browser</a>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<TabKey>('overview');
  const current = cards[active];

  return (
    <main className="app-shell">
      <section className="hero-grid">
        <aside className="brand-panel">
          <div className="brand-mark">RT</div>
          <h1>Reactor Theory</h1>
          <p>Governance. Resonance. Real-world impact.</p>
          <div className="status-card">
            <span>System Status</span>
            <strong>READY</strong>
          </div>
          <div className="metric-grid">
            <div><b>54</b><span>UAP</span></div>
            <div><b>92</b><span>Ethics</span></div>
            <div><b>88</b><span>Integrity</span></div>
            <div><b>0.202</b><span>Drift</span></div>
          </div>
          <a className="github" href="https://github.com/TheBluCog/ReactorTheory">GitHub</a>
        </aside>

        <section className="command-panel">
          <nav className="tabbar" aria-label="Primary sections">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActive(tab.key)} className={active === tab.key ? 'active' : ''}>
                {tab.label}
              </button>
            ))}
          </nav>

          <article className={`content-card mode-${active}`}>
            <p className="eyebrow">{current.eyebrow}</p>
            <h2>{current.title}</h2>
            <p className="bodycopy">{current.body}</p>
            <div className="pill-grid">
              {current.bullets.map((b) => <span key={b}>{b}</span>)}
            </div>

            {active === 'shauna' && (
              <div className="shauna-board">
                <div><b>91.4</b><span>RT11 Score</span></div>
                <div><b>Place</b><span>Active Pathway</span></div>
                <div><b>7</b><span>Market Signals</span></div>
                <div><b>Live</b><span>Operator Session</span></div>
              </div>
            )}

            {active === 'api' && (
              <div className="api-stack">
                {apiLinks.map((href) => <CopyLink key={href} href={href} />)}
              </div>
            )}
          </article>
        </section>
      </section>
    </main>
  );
}
