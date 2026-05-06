import { useState } from 'react';

type TabKey = 'overview' | 'artymus' | 'rt11' | 'ethic' | 'shauna' | 'spirit' | 'api';
type Tone = 'reactor' | 'warm' | 'vault' | 'luxury';

type Card = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  tone?: Tone;
  proof: Record<string, string>;
  json: Record<string, unknown>;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'artymus', label: 'ARTYMUS' },
  { key: 'rt11', label: 'RT11' },
  { key: 'ethic', label: 'Ethic Vault' },
  { key: 'shauna', label: 'Shauna / Maybe' },
  { key: 'spirit', label: 'LetsBuySpirit' },
  { key: 'api', label: 'API' },
];

const runtimeMetrics = [
  { label: 'API', value: 'GREEN', sub: 'json route active' },
  { label: 'Mode', value: 'DEMO', sub: 'safe default' },
  { label: 'License', value: 'EVL', sub: 'agentic governed' },
  { label: 'Ledger', value: 'CDL', sub: 'updated' },
];

const cards: Record<TabKey, Card> = {
  overview: {
    eyebrow: 'REACTOR THEORY COMMAND CENTER',
    title: 'Governance-first AI infrastructure.',
    body: 'Reactor Theory is the control architecture: ARTYMUS operates the system, RT11 scores useful contribution, Ethic Vault governs execution, and the CDL records what is canonically true.',
    bullets: ['Runtime proof', 'Demo-safe execution', 'Ethic Vault license', 'Human review', 'CDL ledgered'],
    proof: {
      'Production': 'reactor-theory.vercel.app',
      'Branch': 'main',
      'Stack': 'RT11 / ARTYMUS 3.0.1',
      'Route': 'api/artymus.ts',
    },
    json: {
      ok: true,
      system: 'Reactor Theory',
      stack: 'RT11 / ARTYMUS 3.0.1',
      governance: 'Ethic Vault',
      executionMode: 'demo',
      cdl: 'ACTIVE',
    },
  },
  artymus: {
    eyebrow: 'ARTYMUS OPERATOR SYSTEM',
    title: 'Operator layer for governed intelligence.',
    body: 'ARTYMUS exposes the machine state: API health, route proof, governance posture, agent loop status, decision readiness, and human-operable control points before action happens.',
    bullets: ['Operator console', 'Runtime checks', 'Agent routing', 'Proof status', 'API health', 'Governance loop'],
    proof: {
      'Service': 'ARTYMUS',
      'Version': '3.0.1',
      'Health': 'green',
      'Endpoint': '/api/artymus?action=health',
    },
    json: {
      service: 'ARTYMUS',
      version: '3.0.1',
      status: 'LIVE',
      health: 'green',
      route: '/api/artymus.ts',
    },
  },
  rt11: {
    eyebrow: 'SAFE AI INCOME SYSTEM',
    title: 'Useful work in. Verifiable payout out.',
    body: 'RT11 turns contribution into scored, governed, auditable output. Good work increases payout weight. Drift, spam, scams, fake content, and manipulation reduce or block execution.',
    bullets: ['Contribution score', 'Payout weight', 'Risk penalty', 'Wallet gate', 'Proof panel', 'Testnet next'],
    tone: 'warm',
    proof: {
      'Score Model': '(E × I × C) / D',
      'Execution': 'demo default',
      'Testnet': 'Polygon Amoy ready',
      'Gate': 'no placeholder execution',
    },
    json: {
      engine: 'RT11',
      equation: 'UAP=(E*I*C)/D',
      executionMode: 'demo',
      payout: 'simulated',
      safety: 'placeholder-addresses-blocked',
    },
  },
  ethic: {
    eyebrow: 'ETHIC VAULT GOVERNANCE PLANE',
    title: 'Before action. Not after.',
    body: 'Ethic Vault is the control layer: license, policy, proof, audit memory, verification, and non-bypass execution constraints wired directly into the agentic path.',
    bullets: ['Agentic license', 'Policy engine', 'Runtime governor', 'Audit memory', 'Verification', 'Non-bypass'],
    tone: 'vault',
    proof: {
      'License': 'Ethic Vault Agentic License',
      'Framework': 'Open Agentic Framework',
      'Policy': 'governance-first',
      'Review': 'human-operable',
    },
    json: {
      license: 'Ethic Vault Agentic License',
      framework: 'Open Agentic Framework',
      constraints: ['auditability', 'attribution', 'non-bypass', 'safe deployment'],
      status: 'ENFORCED',
    },
  },
  shauna: {
    eyebrow: 'ARTYMUS / SHAUNA LEE LANGE / MAYBE',
    title: 'Luxury surface. Intelligence underneath.',
    body: 'Maybe Art Consultancy becomes the high-trust operator surface: valuation coherence, provenance, relationship mapping, execution pathways, and private decision support for rarefied art markets.',
    bullets: ['Maybe Art Consultancy', 'Valuation layer', 'Mapping layer', 'Execution layer', 'Private / Personal / Precise'],
    tone: 'luxury',
    proof: {
      'RT11 Score': '91.4',
      'Pathway': 'Place',
      'Signals': '7',
      'Session': 'operator live',
    },
    json: {
      operator: 'Shauna / Maybe',
      surface: 'professional art advisory',
      score: 91.4,
      pathway: 'Place',
      status: 'operator-ready',
    },
  },
  spirit: {
    eyebrow: 'LETSBUYSPIRIT PARTICIPATION RAIL',
    title: 'Public participation with the mechanism visible.',
    body: 'LetsBuySpirit is the public rail for contribution, attention, verification, reward, and governance visibility. No black box. No fake mystique. The rail shows how participation becomes proof.',
    bullets: ['Buy in', 'Verify', 'Contribute', 'Reward', 'Governance visible', 'Public proof'],
    tone: 'warm',
    proof: {
      'Rail': 'public participation',
      'State': 'published plan',
      'Proof': 'visible mechanism',
      'Mode': 'community-safe',
    },
    json: {
      rail: 'LetsBuySpirit',
      participation: 'public',
      mechanism: 'visible',
      governance: 'linked-to-Ethic-Vault',
    },
  },
  api: {
    eyebrow: 'JSON PROOF ENDPOINTS',
    title: 'Clicking API routes must show JSON.',
    body: 'The ARTYMUS API is the proof surface for deployment state. If an API URL shows the React UI shell, routing is wrong. The canonical handler is flat: api/artymus.ts.',
    bullets: ['Root JSON', 'Health JSON', 'Links JSON', 'No SPA fallback', 'No nested ambiguity'],
    proof: {
      'Canonical': 'api/artymus.ts',
      'Removed': 'api/artymus/index.ts',
      'Fallback': 'non-api only',
      'Cache': 'redeploy no-cache',
    },
    json: {
      ok: true,
      route: '/api/artymus.ts',
      expected: 'raw-json',
      health: '/api/artymus?action=health',
    },
  },
};

const apiLinks = [
  'https://reactor-theory.vercel.app/api/artymus',
  'https://reactor-theory.vercel.app/api/artymus?action=health',
  'https://reactor-theory.vercel.app/api/artymus?action=links',
];

const proofLedger = [
  ['CDL', 'ACTIVE'],
  ['API route', 'flat'],
  ['Nested route', 'removed'],
  ['License', 'Ethic Vault'],
];

function CopyLink({ href }: { href: string }) {
  return (
    <div className="linkbox">
      <code>{href}</code>
      <a href={href} target="_blank" rel="noreferrer">Open in external browser</a>
    </div>
  );
}

function JsonPreview({ data }: { data: Record<string, unknown> }) {
  return <pre className="json-preview">{JSON.stringify(data, null, 2)}</pre>;
}

export default function App() {
  const [active, setActive] = useState<TabKey>('overview');
  const current = cards[active];
  const modeClass = current.tone ? ` tone-${current.tone}` : '';

  return (
    <main className="app-shell">
      <section className="hero-grid">
        <aside className="brand-panel">
          <div className="brand-topline">
            <div className="brand-mark">RT</div>
            <span>CDL ACTIVE</span>
          </div>
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
          <div className="live-strip">
            {runtimeMetrics.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <b>{m.value}</b>
                <small>{m.sub}</small>
              </div>
            ))}
          </div>
          <a className="github" href="https://github.com/TheBluCog/ReactorTheory" target="_blank" rel="noreferrer">GitHub</a>
        </aside>

        <section className="command-panel">
          <nav className="tabbar" aria-label="Primary sections">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActive(tab.key)} className={active === tab.key ? 'active' : ''}>
                {tab.label}
              </button>
            ))}
          </nav>

          <article className={`content-card mode-${active}${modeClass}`}>
            <div className="content-main">
              <p className="eyebrow">{current.eyebrow}</p>
              <h2>{current.title}</h2>
              <p className="bodycopy">{current.body}</p>
              <div className="pill-grid">
                {current.bullets.map((b) => <span key={b}>{b}</span>)}
              </div>
            </div>

            <div className="proof-grid">
              <section className="proof-panel">
                <h3>Live Proof</h3>
                {Object.entries(current.proof).map(([k, v]) => (
                  <div className="proof-row" key={k}><span>{k}</span><b>{v}</b></div>
                ))}
              </section>
              <section className="proof-panel">
                <h3>JSON Preview</h3>
                <JsonPreview data={current.json} />
              </section>
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

            <div className="ledger-strip">
              {proofLedger.map(([k, v]) => <span key={k}><b>{k}</b>{v}</span>)}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
