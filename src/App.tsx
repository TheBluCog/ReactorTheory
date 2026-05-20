import { FormEvent, useState } from 'react';

type Entry = { type: 'system' | 'input' | 'output' | 'warn'; text: string };

type Action = {
  cmd: string;
  label: string;
  helper: string;
};

const actions: Action[] = [
  { cmd: 'HELP', label: 'What do I do?', helper: 'Start here' },
  { cmd: 'CALM', label: 'Calm me down', helper: 'Reset first' },
  { cmd: 'DOCUMENT', label: 'Document incident', helper: 'Save facts' },
  { cmd: 'TIMELINE', label: 'Build timeline', helper: 'Sort dates' },
  { cmd: 'LAWYER', label: 'Brief lawyer', helper: 'Clean summary' },
  { cmd: 'REWRITE', label: 'Rewrite safely', helper: 'No anger' },
  { cmd: 'CHECK', label: 'Check risk', helper: 'Avoid mistakes' },
  { cmd: 'CLEAR', label: 'Reset', helper: 'Start over' },
];

const boot: Entry[] = [
  { type: 'system', text: 'Chuck is online. You are not here to fight. You are here to get organized.' },
  { type: 'output', text: 'First rule: do not send the angry message. Document it. Date it. Save it. Let counsel review it.' },
  { type: 'output', text: 'Pick a button below. Start with “What do I do?” if you are overwhelmed.' },
];

function respond(raw: string): Entry[] {
  const input = raw.trim();
  const cmd = input.toUpperCase();
  if (!input) return [{ type: 'warn', text: 'Nothing entered. Tap a button or type what happened in plain language.' }];
  if (cmd === 'HELP') return [{ type: 'output', text: 'Do this now: 1) breathe, 2) do not reply emotionally, 3) save the message or event, 4) write the date/time, 5) send the clean version to your lawyer or support person.' }];
  if (cmd === 'CALM') return [{ type: 'output', text: 'Calm protocol: put the phone down for 10 minutes. No response while activated. Your power is the record, not the reaction.' }];
  if (cmd === 'DOCUMENT') return [{ type: 'output', text: 'Incident note template: Date/time. What happened. Exact words if available. Who was present. Screenshot/export saved? Impact on parenting, safety, finances, or communication. No insults. Just facts.' }];
  if (cmd === 'TIMELINE') return [{ type: 'output', text: 'Timeline builder: list events oldest to newest. One event per line. Start each line with date. Attach proof. Mark missing dates as UNKNOWN, not guessed.' }];
  if (cmd === 'LAWYER') return [{ type: 'output', text: 'Lawyer brief: “Here are the dated facts, supporting records, what I need help deciding, and what I am not going to do without advice.” Keep it short. Keep it clean.' }];
  if (cmd === 'REWRITE') return [{ type: 'output', text: 'Court-safe rewrite rule: remove insults, motives, diagnoses, and certainty you cannot prove. Replace with dates, observable conduct, exact words, and records.' }];
  if (cmd === 'CHECK') return [{ type: 'warn', text: 'Risk check: do not threaten, publish, contact repeatedly, involve the kids as messengers, violate orders, or improvise legal strategy. HOLD means lawyer review.' }];
  if (cmd === 'CLEAR') return [];
  return [{ type: 'input', text: `You wrote: ${input}` }, { type: 'output', text: 'Chuck response: turn this into a dated fact. What date did it happen? What proof do you have? What is the safest next step that does not escalate?' }];
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(boot);
  const [input, setInput] = useState('');
  const [active, setActive] = useState('HELP');

  function run(command: string) {
    const next = respond(command);
    if (command.trim().toUpperCase() === 'CLEAR') {
      setEntries(boot);
      setInput('');
      setActive('HELP');
      return;
    }
    setEntries((prev) => [...prev, { type: 'input', text: `> ${command}` }, ...next]);
    setInput('');
    setActive(command.toUpperCase());
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    run(input);
  }

  return (
    <main className="tui-root dad-root">
      <section className="tui-frame dad-frame">
        <header className="tui-header dad-header">
          <div>
            <p className="tui-kicker">AGENT CHUCK</p>
            <h1>Dad, stay calm.</h1>
            <p className="dad-subtitle">Do not react. Build the record.</p>
          </div>
          <div className="tui-badge">SAFE MODE</div>
        </header>

        <section className="dad-next-step">
          <span>Next safest move</span>
          <b>Document first. Reply later, if counsel says so.</b>
        </section>

        <section className="tui-status dad-status">
          <div><span>Posture</span><b>HOLD</b></div>
          <div><span>Goal</span><b>PROOF</b></div>
          <div><span>Tone</span><b>CALM</b></div>
          <div><span>Risk</span><b>NO ESCALATION</b></div>
        </section>

        <section className="tui-actions dad-actions">
          {actions.map((action) => (
            <button key={action.cmd} className={active === action.cmd ? 'active' : ''} onClick={() => run(action.cmd)}>
              <b>{action.label}</b>
              <span>{action.helper}</span>
            </button>
          ))}
        </section>

        <section className="tui-screen dad-screen" aria-live="polite">
          {entries.map((entry, index) => (
            <p key={`${entry.text}-${index}`} className={`line ${entry.type}`}>{entry.text}</p>
          ))}
        </section>

        <form className="tui-input dad-input" onSubmit={submit}>
          <span>Tell Chuck:</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="What happened?" />
          <button type="submit">Sort it</button>
        </form>

        <footer className="tui-footer dad-footer">
          <span>No angry texts</span>
          <span>No public posts</span>
          <span>No guessing</span>
          <span>Save proof</span>
        </footer>
      </section>
    </main>
  );
}
