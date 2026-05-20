import { FormEvent, useState } from 'react';

type Mode = 'calm' | 'document' | 'lawyer' | 'rewrite';

const modeLabels: Record<Mode, string> = {
  calm: 'Calm plan',
  document: 'Document it',
  lawyer: 'Lawyer brief',
  rewrite: 'Safe rewrite',
};

const sampleResponses: Record<Mode, string> = {
  calm: 'Do not answer right now. Take ten minutes. Save the message. Your job is not to win the argument. Your job is to protect the record and stay steady.',
  document: 'Write one clean note: date, time, what happened, exact words if available, who was present, proof saved, and impact on parenting or safety. No insults. No guesses.',
  lawyer: 'Send counsel the dated facts, supporting records, what decision you need help with, and what you are not going to do without advice. Keep it short and factual.',
  rewrite: 'Remove anger, motive-reading, labels, and accusations you cannot prove. Use observable conduct, exact dates, exact words, and attached records.',
};

function answer(mode: Mode, text: string) {
  if (!text.trim()) return sampleResponses[mode];
  return sampleResponses[mode] + ' Based on what you wrote, the next safe move is: turn it into a dated fact, save proof, and do not escalate contact.';
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
          <h1>Dad, stay calm.</h1>
          <span>Do not react. Build the record.</span>
        </header>

        <section className="demo-alert">
          <b>Next safest move</b>
          <span>Document first. Reply later, if counsel says so.</span>
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
          <textarea id="incident" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste or type the message, event, or problem here." />
          <button type="submit">Sort it calmly</button>
        </form>

        <section className="demo-response">
          <div>
            <span>Chuck says</span>
            <b>{modeLabels[mode]}</b>
          </div>
          <p>{response}</p>
        </section>

        <footer className="demo-footer">
          <span>No angry texts</span>
          <span>No public posts</span>
          <span>No guessing</span>
          <span>Save proof</span>
        </footer>
      </section>
    </main>
  );
}
