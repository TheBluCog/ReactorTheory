import { FormEvent, useState } from 'react';

type Mode = 'client' | 'issues' | 'prep' | 'reply';
type Jurisdiction = 'Ontario' | 'Canada' | 'US' | 'Other';

const modeLabels: Record<Mode, string> = {
  client: 'Client view',
  issues: 'Spot issues',
  prep: 'Prep counsel',
  reply: 'Clean reply',
};

const notes: Record<Jurisdiction, string> = {
  Ontario: 'Ontario selected. Organize facts around parenting communication, family violence patterns, safety, evidence, and court-safe wording.',
  Canada: 'Canada selected. Rules vary by province. Use this to prepare facts and questions for local counsel.',
  US: 'US selected. Rules vary by state. Use this to prepare facts and questions for a local attorney.',
  Other: 'Jurisdiction not confirmed. Keep this to documentation, safety, and counsel-prep until local rules are checked.',
};

const responses: Record<Mode, string> = {
  client: 'Start with facts, not conclusions. Save the record, write the date and time, and slow the situation down before responding.',
  issues: 'Possible topics to review: parenting impact, communication problems, pressure tactics, financial stress, safety concerns, and repeated patterns over time.',
  prep: 'Counsel-prep format: what happened, when it happened, what proof exists, why it matters, and what decision you need reviewed.',
  reply: 'Use a short neutral reply. Confirm logistics, avoid blame, avoid legal threats, and keep the message something you would be comfortable showing in court.',
};

function answer(mode: Mode, jurisdiction: Jurisdiction, text: string) {
  const next = text.trim() ? 'For what you entered: turn it into dated facts, attach proof, and ask counsel before making a strategic move.' : 'Enter the message, incident, or decision when ready.';
  return notes[jurisdiction] + ' ' + responses[mode] + ' ' + next;
}

export default function App() {
  const [mode, setMode] = useState<Mode>('client');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('Ontario');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(answer('client', 'Ontario', ''));

  function choose(next: Mode) {
    setMode(next);
    setResponse(answer(next, jurisdiction, input));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResponse(answer(mode, jurisdiction, input));
  }

  function updateJurisdiction(value: string) {
    const next = value as Jurisdiction;
    setJurisdiction(next);
    setResponse(answer(mode, next, input));
  }

  return (
    <main className="demo-root">
      <section className="demo-card">
        <header className="demo-header">
          <p>AGENT CHUCK</p>
          <h1>Counsel-ready. Dad-safe.</h1>
          <span>Jurisdiction-aware issue spotting and calm preparation for lawyer review.</span>
        </header>

        <section className="demo-alert">
          <b>Jurisdiction</b>
          <select value={jurisdiction} onChange={(event) => updateJurisdiction(event.target.value)}>
            <option value="Ontario">Ontario</option>
            <option value="Canada">Canada - other province</option>
            <option value="US">United States</option>
            <option value="Other">Other</option>
          </select>
        </section>

        <section className="demo-modes" aria-label="Choose support mode">
          {(Object.keys(modeLabels) as Mode[]).map((key) => (
            <button key={key} className={mode === key ? 'active' : ''} onClick={() => choose(key)}>
              {modeLabels[key]}
            </button>
          ))}
        </section>

        <form className="demo-prompt" onSubmit={submit}>
          <label htmlFor="incident">Client facts</label>
          <textarea id="incident" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type the message, incident, court issue, or decision you are facing." />
          <button type="submit">Prepare calm guidance</button>
        </form>

        <section className="demo-response">
          <div>
            <span>Chuck says</span>
            <b>{modeLabels[mode]}</b>
          </div>
          <p>{response}</p>
        </section>

        <footer className="demo-footer">
          <span>Check jurisdiction</span>
          <span>Save proof</span>
          <span>Use facts</span>
          <span>Ask counsel</span>
        </footer>
      </section>
    </main>
  );
}
