import crypto from 'crypto';
import { appendWormEvent, EVENT_TYPES } from './audit.js';
import { classifyThreat, hasHardThreat, hasSoftThreat } from './threat-detection.js';

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
  return sig === computed;
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
  const now = Date.now();
  const body = req.body;

  const replayed = body?.nonce ? isReplay(body.nonce) : false;
  const blockedTerms = blockedTermsPresent(body);

  const signatureFailed = body?.proof ? !verifySignature(body, body.proof.sig) : true;

  const expectedRoute = body?.cid ? deriveRoute(body.cid, 'exec', body.epoch) : null;
  const routeMismatch = expectedRoute ? !req.url.includes(expectedRoute) : true;

  const findings = classifyThreat({
    body,
    url: req.url,
    now,
    blockedTermsPresent: blockedTerms,
    replayed,
    signatureFailed,
    routeMismatch
  });

  let decision = EVENT_TYPES.PASS;

  if (hasHardThreat(findings)) {
    decision = EVENT_TYPES.HARD_BLOCK;
  } else if (hasSoftThreat(findings)) {
    decision = EVENT_TYPES.SOFT_FRICTION;
  }

  appendWormEvent({
    type: decision,
    cid: body?.cid,
    route: req.url,
    metadata: findings
  });

  if (decision === EVENT_TYPES.HARD_BLOCK) {
    return res.status(403).json({ status: 'BLOCK' });
  }

  if (decision === EVENT_TYPES.SOFT_FRICTION) {
    return res.status(200).json({ status: 'SOFT_FRICTION' });
  }

  return res.status(200).json({ status: 'PASS' });
}
