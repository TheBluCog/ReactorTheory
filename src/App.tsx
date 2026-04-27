import './styles.css'

type Transaction = {
  time: string
  tenant: string
  type: string
  amount: string
  status: 'PAID' | 'PENDING' | 'BLOCKED'
  cdl: string
}

type GovernanceEvent = {
  time: string
  tenant: string
  policy: string
  decision: 'PASS' | 'AUDIT' | 'BLOCK'
  uap: string
  ledger: string
}

const transactions: Transaction[] = [
  { time: '22:05:43', tenant: 'banking-demo', type: 'Growth subscription', amount: '$199.00', status: 'PAID', cdl: 'CDL-7A9F-001' },
  { time: '22:01:18', tenant: 'health-ai', type: 'Usage overage', amount: '$48.72', status: 'PENDING', cdl: 'CDL-7A9F-002' },
  { time: '21:58:10', tenant: 'legal-ops', type: 'Enterprise pilot', amount: '$2,500.00', status: 'PAID', cdl: 'CDL-7A9F-003' },
  { time: '21:54:52', tenant: 'public-sector', type: 'Billing enforcement', amount: '$0.00', status: 'BLOCKED', cdl: 'CDL-7A9F-004' },
]

const governanceEvents: GovernanceEvent[] = [
  { time: '22:05:44', tenant: 'banking-demo', policy: 'banking', decision: 'PASS', uap: '63,882', ledger: 'ev://banking-demo/a93f21bc' },
  { time: '22:04:11', tenant: 'health-ai', policy: 'healthcare', decision: 'AUDIT', uap: '28,116', ledger: 'ev://health-ai/c813aa01' },
  { time: '22:02:40', tenant: 'public-sector', policy: 'public-sector', decision: 'BLOCK', uap: '9,442', ledger: 'ev://public-sector/8821fd19' },
  { time: '21:59:33', tenant: 'legal-ops', policy: 'legal', decision: 'PASS', uap: '51,204', ledger: 'ev://legal-ops/44ab9e2c' },
]

const cdlEntries = [
  'CDL://reactor-theory/tenant/banking-demo/payment/stripe/pi_9F2A/status/PAID',
  'CDL://reactor-theory/tenant/health-ai/usage/overage/status/PENDING',
  'CDL://reactor-theory/tenant/legal-ops/contract/pilot/status/PAID',
  'CDL://reactor-theory/tenant/public-sector/billing/enforcement/status/BLOCKED',
]

function App() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">EV</span>
          <div>
            <strong>Ethic Vault</strong>
            <small>Revenue Control Plane</small>
          </div>
        </div>

        <nav className="nav-stack">
          <a className="active" href="#money">Money Screen</a>
          <a href="#transactions">Transactions</a>
          <a href="#cdl">CDL Ledger</a>
          <a href="#governance">Governance</a>
          <a href="#tenants">Tenants</a>
          <a href="#billing">Billing</a>
        </nav>

        <div className="operator-card">
          <span>Deployment</span>
          <strong>reactor-theory.vercel.app</strong>
          <small>STATUS: LIVE / BILLING ENFORCED</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">ETHIC VAULT // REACTOR THEORY</p>
            <h1>Enterprise AI Governance + Revenue Dashboard</h1>
            <p className="subtitle">Money screen, latest transactions, CDL ledger, tenant usage, and deterministic AI output enforcement in one operator console.</p>
          </div>
          <div className="topbar-actions">
            <button>Export CDL</button>
            <button className="primary">Create Invoice</button>
          </div>
        </header>

        <section className="money-grid" id="money">
          <article className="money-card hero-money">
            <p>Monthly Recurring Revenue</p>
            <strong>$18,742</strong>
            <span>+24.8% projected growth</span>
          </article>
          <article className="money-card">
            <p>Governed Calls</p>
            <strong>128,440</strong>
            <span>32,004 billable this cycle</span>
          </article>
          <article className="money-card">
            <p>Paid Tenants</p>
            <strong>12</strong>
            <span>3 enterprise pilots</span>
          </article>
          <article className="money-card danger">
            <p>Blocked Value Risk</p>
            <strong>$402K</strong>
            <span>prevented exposure estimate</span>
          </article>
        </section>

        <section className="main-grid">
          <article className="panel" id="transactions">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">LATEST TRANSACTIONS</p>
                <h2>Stripe + billing enforcement stream</h2>
              </div>
              <span className="status-pill">LIVE</span>
            </div>
            <div className="table tx-table">
              <div className="table-head"><span>Time</span><span>Tenant</span><span>Type</span><span>Amount</span><span>Status</span><span>CDL</span></div>
              {transactions.map((tx) => (
                <div className="table-row" key={tx.cdl}>
                  <span>{tx.time}</span>
                  <span>{tx.tenant}</span>
                  <span>{tx.type}</span>
                  <strong>{tx.amount}</strong>
                  <b className={tx.status.toLowerCase()}>{tx.status}</b>
                  <code>{tx.cdl}</code>
                </div>
              ))}
            </div>
          </article>

          <article className="panel cdl-panel" id="cdl">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">CDL LEDGER</p>
                <h2>Canonical Data Layer</h2>
              </div>
              <span className="status-pill good">ANCHOR READY</span>
            </div>
            <pre>{cdlEntries.join('\n')}</pre>
          </article>
        </section>

        <section className="main-grid secondary">
          <article className="panel" id="governance">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">GOVERNANCE EVENTS</p>
                <h2>PASS / AUDIT / BLOCK decisions</h2>
              </div>
              <span className="status-pill">/api/govern</span>
            </div>
            <div className="table gov-table">
              <div className="table-head"><span>Time</span><span>Tenant</span><span>Policy</span><span>Decision</span><span>UAP</span><span>Ledger</span></div>
              {governanceEvents.map((event) => (
                <div className="table-row" key={`${event.time}-${event.ledger}`}>
                  <span>{event.time}</span>
                  <span>{event.tenant}</span>
                  <span>{event.policy}</span>
                  <b className={event.decision.toLowerCase()}>{event.decision}</b>
                  <span>{event.uap}</span>
                  <code>{event.ledger}</code>
                </div>
              ))}
            </div>
          </article>

          <article className="panel command-panel" id="billing">
            <p className="eyebrow">MONEY COMMAND</p>
            <h2>Billing Gate</h2>
            <div className="gate-readout pass">ACTIVE</div>
            <p className="muted">Billing check runs before governed AI execution. Inactive tenants and over-limit tenants are blocked before model calls.</p>
            <button className="primary full-width">OPEN STRIPE CHECKOUT</button>
          </article>
        </section>

        <section className="tenant-grid" id="tenants">
          {['banking-demo', 'health-ai', 'legal-ops', 'public-sector'].map((tenant, index) => (
            <article className="tenant-card" key={tenant}>
              <p>{tenant}</p>
              <strong>{['Growth', 'Enterprise', 'Pilot', 'Blocked'][index]}</strong>
              <span>{['64%', '41%', '18%', '100%'][index]} usage</span>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
