import { FormEvent, useMemo, useState } from 'react';

type Entry = { type: 'system' | 'input' | 'output' | 'warn'; text: string };

const commands = ['HELP', 'CLASSIFY', 'TIMELINE', 'DRIFT', 'PACKET', 'BRIEF', 'REDACT', 'HASH', 'CLEAR'];

const boot: Entry[] = [
  { type: 'system', text: 'AGENT CHUCK v1.0.0 :: TUI SIMULATION ONLINE' },
  { type: 'system', text: 'MODE: ADVISORY / EVIDENCE-CONTROL / NO ESCALATION' },
  { type: 'system', text: 'CONTROL: ALLOW | HOLD | BLOCK | PROOF' },
  { type: 'output', text: 'Operational calm wins. Evidence moves. Noise dies.' },
];

function respond(raw: string): Entry[] {
  const input = raw.trim();
  const cmd = input.toUpperCase();
  if (!input) return [{ type: 'warn', text: 'NO COMMAND ENTERED. TYPE HELP.' }];
  if (cmd === 'HELP') return [{ type: 'output', text: 'COMMANDS: CLASSIFY, TIMELINE, DRIFT, PACKET, BRIEF, REDACT, HASH, CLEAR' }];
  if (cmd === 'CLASSIFY') return [{ type: 'output', text: 'CLASSIFY SAMPLE -> POSTURE: HOLD | RISK: MEDIUM | FLAGS: litigation_abuse, child_related_control | NEXT: build dated chronology for counsel review.' }];
  if (cmd === 'TIMELINE') return [{ type: 'output', text: 'TIMELINE -> 001 intake opened | 002 source records indexed | 003 events sorted by date | 004 missing dates flagged.' }];
  if (cmd === 'DRIFT') return [{ type: 'output', text: 'DRIFT AUDIT -> unsupported claims: 2 | missing dates: 3 | emotional phrasing: 4 | recommended posture: HOLD.' }];
  if (cmd === 'PACKET') return [{ type: 'output', text: 'EVIDENCE PACKET -> CHUCK-EVIDENCE-DRAFT | custody: screenshot/export | status: review-only | counsel_note: verify source authenticity.' }];
  if (cmd === 'BRIEF') return [{ type: 'output', text: 'COUNSEL BRIEF -> facts, dates, records, pattern tags, evidentiary gaps, proposed lawyer questions. STATUS: DRAFT.' }];
  if (cmd === 'REDACT') return [{ type: 'output', text: 'REDACTION -> emails, phone numbers, addresses, child identifiers masked by default. STATUS: PRIVACY-FIRST.' }];
  if (cmd === 'HASH') return [{ type: 'output', text: 'HASH CHAIN -> canonical JSON prepared -> SHA-256 placeholder generated -> record locked for audit simulation.' }];
  if (cmd === 'CLEAR') return [];
  return [{ type: 'warn', text: `UNKNOWN COMMAND: ${input}. TYPE HELP.` }];
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(boot);
  const [input, setInput] = useState('');
  const [active, setActive] = useState('HELP');

  const status = useMemo(() => ({ posture: 'HOLD', risk: 'MEDIUM', mode: 'SAFE', proof: 'READY' }), []);

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
    <main className="tui-root">
      <section className="tui-frame">
        <header className="tui-header">
          <div>
            <p className="tui-kicker">AGENT CHUCK // INTERACTIVE TUI</p>
            <h1>Evidence Control Console</h1>
          </div>
          <div className="tui-badge">LIVE</div>
        </header>

        <section className="tui-status">
          {Object.entries(status).map(([key, value]) => (
            <div key={key}><span>{key}</span><b>{value}</b></div>
          ))}
        </section>

        <section className="tui-actions">
          {commands.map((cmd) => (
            <button key={cmd} className={active === cmd ? 'active' : ''} onClick={() => run(cmd)}>{cmd}</button>
          ))}
        </section>

        <section className="tui-screen" aria-live="polite">
          {entries.map((entry, index) => (
            <p key={`${entry.text}-${index}`} className={`line ${entry.type}`}>{entry.text}</p>
          ))}
        </section>

        <form className="tui-input" onSubmit={submit}>
          <span>&gt;</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="TYPE COMMAND" autoCapitalize="characters" />
          <button type="submit">RUN</button>
        </form>

        <footer className="tui-footer">
          <span>ALLOW = document</span>
          <span>HOLD = counsel review</span>
          <span>BLOCK = no escalation</span>
          <span>PROOF = evidence first</span>
        </footer>
      </section>
    </main>
  );
}
