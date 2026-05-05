const sections = [
  { id: 'reactor', label: 'REACTOR', tone: 'orange' },
  { id: 'artymus', label: 'ARTYMUS', tone: 'violet' },
  { id: 'rt11', label: 'RT11', tone: 'gold' },
  { id: 'ethic-vault', label: 'ETHIC VAULT', tone: 'orange' },
  { id: 'letsbuyspirit', label: 'SPIRIT', tone: 'violet' },
  { id: 'api', label: 'API', tone: 'orange' },
  { id: 'docs', label: 'DOCS', tone: 'gold' }
];

const cards = [
  {
    id: 'artymus',
    eyebrow: 'COMMAND LAYER',
    title: 'ARTYMUS governs the machine room.',
    body: 'ARTYMUS is the operator interface for governed intelligence: control room, command layer, runtime checks, audit signals, and AI command mode. It turns the Reactor Theory stack into something a human can actually steer.',
    cta: 'Open ARTYMUS Control Room',
    href: '/ui/artymus-control-room.html'
  },
  {
    id: 'rt11',
    eyebrow: 'SAFE AI INCOME SYSTEM',
    title: 'RT11 rewards useful AI work without shady shit.',
    body: 'RT11 is the contribution, scoring, payout, and governance layer. Teaching, building, summarizing, reviewing, reducing risk, and improving outcomes can increase payout weight. Spam, scams, fake content, and manipulation get penalized.',
    cta: 'Open RT11 Dashboard',
    href: '/ui/rt11-dashboard.html'
  },
  {
    id: 'ethic-vault',
    eyebrow: 'GOVERNANCE + PROOF',
    title: 'Ethic Vault keeps the receipts.',
    body: 'Ethic Vault is the trust, evidence, and governance vault for the stack. It records claims, controls, test outputs, proof artifacts, and audit context so AI systems can be evaluated before they are trusted.',
    cta: 'View API Health',
    href: '/api/artymus?action=health'
  },
  {
    id: 'letsbuyspirit',
    eyebrow: 'PUBLISHED PLAN',
    title: 'LetsBuySpirit turns support into participation.',
    body: 'LetsBuySpirit is the public-facing contribution and community acquisition concept: align attention, capital, proof, and governance around a simple plan people can understand. The operating principle is clean: buy in, verify contribution, reward useful participation, and route value through transparent governance.',
    cta: 'Open Links API',
    href: '/api/artymus?action=links'
  }
];

const metrics = ['Demo mode now', 'API scoring live', 'Testnet next', 'Proof-first'];

export default function App() {
  return (
    <main className="min-h-screen bg-[#090711] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_10%,rgba(255,137,91,.22),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(174,134,255,.24),transparent_30%)]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-6 border-b border-white/10">
        <div>
          <p className="text-3xl font-black tracking-tight">Reactor Theory</p>
          <p className="text-white/55 font-semibold">System: ARTYMUS / RT11 / Ethic Vault / LetsBuySpirit</p>
        </div>
        <a className="rounded-full bg-[#ff8d5c] px-6 py-3 font-black text-black shadow-[0_0_30px_rgba(255,141,92,.35)]" href="https://github.com/TheBluCog/ReactorTheory">GitHub</a>
      </header>

      <div className="relative z-10 h-3 bg-gradient-to-r from-[#b08cff] via-[#ff8d5c] to-[#ffd966]" />

      <section className="relative z-10 grid grid-cols-[116px_1fr] gap-3 px-2 py-6 md:grid-cols-[160px_1fr] md:px-8">
        <nav className="sticky top-4 self-start space-y-3">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`block rounded-l-full px-3 py-5 text-center text-xs font-black tracking-widest text-black shadow-lg md:text-sm ${s.tone === 'violet' ? 'bg-[#b08cff]' : s.tone === 'gold' ? 'bg-[#ffd966]' : 'bg-[#ff8d5c]'}`}>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          <section id="reactor" className="relative overflow-hidden rounded-[2rem] border border-[#ff8d5c]/35 bg-white/[.07] p-7 shadow-[0_0_60px_rgba(255,141,92,.16)] md:p-12">
            <div className="absolute left-0 top-0 h-4 w-1/3 rounded-br-full bg-[#ff8d5c]" />
            <div className="absolute left-1/4 top-0 h-4 w-1/4 rounded-br-full bg-[#b08cff]" />
            <p className="inline-flex rounded-full bg-[#ffd966] px-5 py-3 text-xs font-black tracking-widest text-black">GOVERNED INTELLIGENCE STACK</p>
            <p className="mt-7 text-sm font-black tracking-[.35em] text-[#9cc7ff]">REACTOR THEORY</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.06em] md:text-7xl">Govern intelligence before it governs you.</h1>
            <p className="mt-8 max-w-3xl text-xl font-semibold leading-relaxed text-white/70">Reactor Theory is the system architecture for alignment, drift control, contribution scoring, and proof-based AI governance. ARTYMUS gives it a control room. RT11 gives it economics. Ethic Vault gives it evidence. LetsBuySpirit gives it a public participation rail.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {metrics.map((m) => <span key={m} className="rounded-full border border-[#9cc7ff]/30 bg-[#142036] px-4 py-3 font-black text-[#bcdcff]">{m}</span>)}
            </div>
          </section>

          {cards.map((card) => (
            <section key={card.id} id={card.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#191421]/90 p-7 shadow-[0_0_40px_rgba(176,140,255,.10)] md:p-10">
              <div className="absolute left-0 top-0 h-4 w-1/3 rounded-br-full bg-[#ff8d5c]" />
              <p className="mt-4 inline-flex rounded-full bg-[#ffd966] px-5 py-3 text-xs font-black tracking-widest text-black">{card.eyebrow}</p>
              <h2 className="mt-7 max-w-3xl text-4xl font-black leading-none tracking-[-.05em] md:text-6xl">{card.title}</h2>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-white/68">{card.body}</p>
              <a className="mt-8 inline-flex rounded-full bg-[#b08cff] px-7 py-4 font-black text-black" href={card.href}>{card.cta}</a>
            </section>
          ))}

          <section id="api" className="rounded-[2rem] border border-white/10 bg-white/[.06] p-7 md:p-10">
            <p className="text-sm font-black tracking-[.35em] text-[#9cc7ff]">API / JSON</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Proof links that should return JSON.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[['Root','/api/artymus'],['Health','/api/artymus?action=health'],['Links','/api/artymus?action=links']].map(([label, href]) => (
                <a key={href} className="rounded-2xl border border-white/10 bg-black/30 p-5 font-black text-[#ffd966]" href={href}>{label}<br/><span className="text-xs text-white/50">{href}</span></a>
              ))}
            </div>
          </section>

          <section id="docs" className="rounded-[2rem] border border-white/10 bg-[#120f18] p-7 md:p-10">
            <p className="text-sm font-black tracking-[.35em] text-[#9cc7ff]">DOCS</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.05em]">One stack. Four public faces.</h2>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-white/65">Reactor Theory is the architecture. ARTYMUS is the operator system. RT11 is the economic engine. Ethic Vault is the proof layer. LetsBuySpirit is the public participation plan.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
