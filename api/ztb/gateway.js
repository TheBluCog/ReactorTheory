import crypto from 'crypto';

const SECRET = process.env.ZTB_SECRET || 'dev_secret_change_me';
const NONCE_CACHE = new Set();
const NONCE_TTL_MS = 60 * 1000;

const BLOCKED_TERMS = [
  'RT8',
  'Intent Lattice',
  'y_base',
  'UAP',
  'state_seed',
  'operator_scope',
  'boundary_state'
];

function hmac(data) {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

function verifySignature(body, sig) {
  const computed = hmac(JSON.stringify(body.payload) + body.nonce + body.ts);
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(computed));
}

function isReplay(nonce) {
  if (NONCE_CACHE.has(nonce)) return true;
  NONCE_CACHE.add(nonce);
  setTimeout(() => NONCE_CACHE.delete(nonce), NONCE_TTL_MS);
  return false;
}

function blockedTermsPresent(body) {
  const str = JSON.stringify(body);
  return BLOCKED_TERMS.some(term => str.includes(term));
}

function deriveRoute(clientId, capability, epoch) {
  return hmac(clientId + capability + epoch).slice(0, 8);
}

export default async function handler(req, res) {
  try {
    const body = req.body;

    if (!body || !body.nonce || !body.ts || !body.proof) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    if (blockedTermsPresent(body)) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    if (isReplay(body.nonce)) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    const now = Date.now();
    if (Math.abs(now - body.ts) > 30000) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    if (!verifySignature(body, body.proof.sig)) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    const expectedRoute = deriveRoute(body.cid, 'exec', body.epoch);
    if (!req.url.includes(expectedRoute)) {
      return res.status(403).json({ status: 'BLOCK' });
    }

    return res.status(200).json({ status: 'PASS' });

  } catch (e) {
    return res.status(403).json({ status: 'BLOCK' });
  }
}
