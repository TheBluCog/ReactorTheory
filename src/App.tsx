const nav = [
  ['Home', '#home'],
  ['Reactor Core', '#reactor-core'],
  ['Ethic Vault', '#ethic-vault'],
  ['ARTYMUS', '#artymus'],
  ['RT11', '#rt11'],
  ['Maybe / Shauna', '#maybe'],
  ['LetsBuySpirit', '#letsbuyspirit'],
  ['API', '#api']
];

const blueStats = [['UAP', '54'], ['Ethics', '92'], ['Integrity', '88'], ['Compliance', '84'], ['Drift', '0.202']];
const stack = ['Belief Anchor', 'Policy Engine', 'Runtime Governor', 'Decision Layer', 'Audit & Memory', 'Verification Layer', 'Observability'];
const maybeScores = [['Identity', 94], ['Evidence', 91], ['Demand', 82], ['Control', 88], ['Drift', 22]];

function CodeLink({ href }: { href: string }) {
  return <div className="mt-3"><pre className="overflow-auto rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-sky-200">{href}</pre><a className="mt-2 inline-block text-sm font-bold text-sky-300 underline" href={href}>Open in external browser</a></div>;
}

function BluePanel({ children, className = '' }: { children: any; className?: string }) {
  return <section className={`rounded-2xl border border-sky-400/35 bg-[#04101d]/90 shadow-[0_0_35px_rgba(0,145,255,.18)] ${className}`}>{children}</section>;
}

function MaybePanel({ children, className = '' }: { children: any; className?: string }) {
  return <section className={`border border-stone-400/50 bg-[#ebe6da] text-[#171410] shadow-[14px_14px_0_#050505] ${className}`}>{children}</section>;
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#05080d] text-white">
      <header className="sticky top-0 z-50 border-b border-sky-400/30 bg-[#05080d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#home" className="text-2xl font-black tracking-tight">REACTOR<span className="text-sky-400"> THEORY</span></a>
          <nav className="hidden gap-5 text-xs font-black uppercase tracking-widest text-white/70 lg:flex">
            {nav.map(([label, href]) => <a key={href} href={href} className="hover:text-sky-300">{label}</a>)}
          </nav>
          <a href="https://github.com/TheBluCog/ReactorTheory" className="rounded-full border border-sky-400/40 px-4 py-2 text-xs font-black text-sky-300">GitHub</a>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {nav.map(([label, href]) => <a key={href} href={href} className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black">{label}</a>)}
        </div>
      </header>

      <section id="home" className="relative overflow-hidden border-b border-sky-400/30 bg-[radial-gradient(circle_at_70%_20%,rgba(0,145,255,.25),transparent_35%),linear-gradient(135deg,#06101f,#02050a)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[.35em] text-sky-300">Governance control infrastructure</p>
            <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.05em] md:text-7xl">Governance. Resonance. Real-world impact.</h1>
            <p className="mt-6 max-w-2xl text-xl text-white/70">A full navigation gateway for Reactor Theory, ARTYMUS, RT11, Ethic Vault, Maybe Art Consultancy, and LetsBuySpirit. Built for mobile and desktop, with proof-first API access.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {['Governance', 'Auditability', 'Transparency', 'Resilience'].map(x => <div key={x} className="rounded-2xl border border-sky-400/25 bg-white/5 p-4 text-center font-bold">{x}</div>)}
            </div>
          </div>
          <BluePanel className="p-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-black">System Status</h2><span className="text-green-400">● READY</span></div>
            <div className="mt-6 space-y-4">{blueStats.map(([k, v]) => <div key={k} className="flex justify-between border-b border-white/10 pb-3"><span>{k}</span><b>{v}</b></div>)}</div>
            <p className="mt-6 text-green-300">Risk Level: LOW</p>
          </BluePanel>
        </div>
      </section>

      <section id="reactor-core" className="mx-auto max-w-7xl px-4 py-10">
        <BluePanel className="grid gap-6 p-6 lg:grid-cols-[1fr_.8fr]">
          <div><p className="text-sky-300 font-black tracking-[.3em]">REACTOR CORE</p><h2 className="mt-3 text-4xl font-black">Control before scale.</h2><p className="mt-4 text-white/70">Reactor Core is the governance-first infrastructure layer for ethical, accountable agentic systems. It treats capability as a force that requires active control, traceability, and drift detection.</p></div>
          <div className="rounded-xl border border-sky-400/30 p-5"><p className="text-3xl font-black text-sky-300">UAP = (E × I × C) / D</p><p className="mt-3 text-white/60">Energy, Intent, Control, divided by Drift. More capability requires stronger governance.</p></div>
        </BluePanel>
      </section>

      <section id="ethic-vault" className="mx-auto max-w-7xl px-4 py-10">
        <BluePanel className="p-6">
          <p className="text-sky-300 font-black tracking-[.3em]">ETHIC VAULT STACK</p><h2 className="mt-3 text-4xl font-black">Governance in the loop. Before action. Not after.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{stack.map(x => <div key={x} className="rounded-xl border border-sky-400/25 bg-black/25 p-4"><b>{x}</b><p className="mt-2 text-sm text-white/60">Executable governance layer for agentic systems.</p></div>)}</div>
          <p className="mt-8 text-lg text-white/70">Ethic Vault is the proof and control plane: policy as code, runtime governance, immutable audit memory, verification, observability, and decision gating.</p>
        </BluePanel>
      </section>

      <section id="artymus" className="mx-auto max-w-7xl px-4 py-10">
        <BluePanel className="p-6">
          <p className="text-sky-300 font-black tracking-[.3em]">ARTYMUS</p><h2 className="mt-3 text-4xl font-black">The operator layer for governed intelligence.</h2><p className="mt-4 text-white/70">ARTYMUS exposes the control room, command layer, API scoring, runtime checks, and execution pathways. It is the place where the operator can see the machine and steer it.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">{['Control Room', 'Command Layer', 'Intelligence Layer'].map(x => <div key={x} className="rounded-xl border border-sky-400/25 bg-black/25 p-5 font-black">{x}</div>)}</div>
        </BluePanel>
      </section>

      <section id="rt11" className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2rem] border border-orange-300/40 bg-[#18111c] p-7 shadow-[0_0_45px_rgba(255,137,91,.18)]">
          <p className="inline-block rounded-full bg-[#ffd966] px-5 py-2 font-black text-black">SAFE AI INCOME SYSTEM</p><h2 className="mt-5 text-5xl font-black leading-none tracking-[-.05em]">Make money with AI — without doing shady shit.</h2><p className="mt-5 max-w-3xl text-xl text-white/70">RT11 rewards useful AI work. Teaching, building, summarizing, reviewing, and reducing risk can increase payout weight. Spam, scams, fake content, and manipulation get penalized.</p>
        </div>
      </section>

      <section id="maybe" className="bg-[#ded8ca] px-4 py-12 text-[#171410]">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="border-r border-stone-400/60 pr-6"><h2 className="font-serif text-5xl">Maybe</h2><p className="tracking-widest">ART CONSULTANCY</p><div className="mt-10 space-y-5">{['Valuation Coherence', 'Signal Mapping', 'Professional Art', 'NPC / Company'].map((x, i) => <div className="flex justify-between border-b border-stone-400/40 pb-3" key={x}><span>{x}</span><span>0{i+1}</span></div>)}</div></aside>
          <MaybePanel className="p-8 md:p-12"><p className="uppercase tracking-widest text-stone-500">ARTYMUS 3.0 / SHAUNA LEE LANGE / OPERATOR APP</p><h2 className="mt-6 font-serif text-6xl leading-none">Mechanism visible.<br/>Execution available.</h2><p className="mt-6 max-w-4xl font-serif text-2xl">Professional art surface, valuation intelligence, and ARTYMUS execution are unified in one private control room.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{maybeScores.map(([k,v]) => <div key={k as string}><div className="flex justify-between"><b>{k}</b><b>{v}</b></div><div className="mt-2 h-2 bg-stone-300"><div className="h-2 bg-stone-700" style={{width:`${v}%`}} /></div></div>)}</div></MaybePanel>
        </div>
      </section>

      <section id="letsbuyspirit" className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[.06] p-7"><p className="text-sky-300 font-black tracking-[.3em]">LETSBUYSPIRIT</p><h2 className="mt-3 text-4xl font-black">Public participation rail.</h2><p className="mt-4 text-white/70">LetsBuySpirit is the public-facing participation plan: align attention, capital, contribution, proof, and governance around a simple pathway people can understand. Buy in, verify contribution, reward useful participation, and keep the governance visible.</p></div>
      </section>

      <section id="api" className="mx-auto max-w-7xl px-4 py-10">
        <BluePanel className="p-6"><p className="text-sky-300 font-black tracking-[.3em]">JSON API</p><h2 className="mt-3 text-4xl font-black">Click should show JSON.</h2><CodeLink href="https://reactor-theory.vercel.app/api/artymus"/><CodeLink href="https://reactor-theory.vercel.app/api/artymus?action=health"/><CodeLink href="https://reactor-theory.vercel.app/api/artymus?action=links"/></BluePanel>
      </section>
    </main>
  );
}
