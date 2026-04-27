import http from 'http';
import { generateReceipt } from './receipt.js';

function calculateUAP(E, I, C, D) {
  if (D <= 0.0001) return E * I * C * 10;
  return (E * I * C) / D;
}

function preflight(input) {
  const { energy: E, intent_alignment: I, control_coherence: C, drift: D } = input.state;

  const uap = calculateUAP(E, I, C, D);

  let decision = "PASS";
  let reason = "RT9.1 evaluation";

  if (D > (E * I * C)) {
    decision = "GOVERN";
    reason = "Drift exceeds control capacity";
  } else if (input.proof?.status !== "BOUND") {
    decision = "BLOCK";
    reason = "Unbound proof";
  } else if (uap < 0.5) {
    decision = "BLOCK";
  } else if (uap < 1.5) {
    decision = "AUDIT";
  }

  const receipt = generateReceipt(input, decision, uap);

  return {
    decision,
    uap_score: Number(uap.toFixed(4)),
    reason,
    receipt
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/v1/action/preflight') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const input = JSON.parse(body);
        const output = preflight(input);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(output));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ARTYMUS API running on port ${PORT}`);
});
