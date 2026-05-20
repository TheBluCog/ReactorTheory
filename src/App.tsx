import { FormEvent, useState } from 'react';

type Mode = 'calm' | 'document' | 'lawyer' | 'rewrite';

const modeLabels: Record<Mode, string> = {
  calm: 'Steady first',
  document: 'Capture facts',
  lawyer: 'Prep counsel',
  rewrite: 'Clean reply',
};

const sampleResponses: Record<Mode, string> = {
  calm: 'Pause before responding. Take a few minutes, save the message, and let the adrenaline drop. Your strongest move is a calm record, not a fast reaction.',
  document: 'Create one factual note: date, time, what happened, exact words if you have them, who was present, what proof you saved, and how it affected parenting, safety, money, or communication.',
  lawyer: 'Send counsel a short brief: the dated facts, the records attached, the decision you need help with, and the response you are considering. Ask before sending anything risky.',
  rewrite: 'Keep the reply short, neutral, and child-focused. Remove blame, insults, motives, and legal threats. Use facts, dates, and one clear request or boundary.',
};

function answer(mode: Mode, text: string) {
  if (!text.trim()) return sampleResponses[mode];
  return sampleResponses[mode] + ' For what you entered, the safest next step is to turn it into a dated record, save the proof, and keep any reply brief, neutral, and reviewable.';
}

export default function App() {
  const [mode, setMode] = useState<Mode>('calm');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(sampleResponses.calm);

  function choose(next: Mode) {
    setMode(next);
    setResponse(answer(next, input));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResponse(answer(mode, input));
  }

  return (
    <main className="demo-root">
      <section className="demo-card">
        <header className="demo-header">
          <p>AGENT CHUCK</p>
          <h1>Stay steady.</h1>
          <span>Protect your kids. Protect the record. Respond with control.</span>
        </header>

        <section className="demo-alert">
          <b>Best next move</b>
          <span>Save the proof. Write the facts. Get advice before you reply.</span>
        </section>

        <section className="demo-modes" aria-label="Choose support mode">
          {(Object.keys(modeLabels) as Mode[]).map((key) => (
            <button key={key} className={mode === key ? 'active' : ''} onClick={() => choose(key)}>
              {modeLabels[key]}
            </button>
          ))}
        </section>

        <form className="demo-prompt" onSubmit={submit}>
          <label htmlFor="incident">What happened?</label>
          <textarea id="incident" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type the message, incident, or decision you are facing." />
          <button type="submit">Give me the calm plan</button>
        </form>

        <section className="demo-response">
          <div>
            <span>Chuck says</span>
            <b>{modeLabels[mode]}</b>
          </div>
          <p>{response}</p>
        </section>

        <footer className="demo-footer">
          <span>Stay calm</span>
          <span>Save proof</span>
          <span>Use facts</span>
          <span>Ask counsel</span>
        </footer>
      </section>
    </main>
  );
}
