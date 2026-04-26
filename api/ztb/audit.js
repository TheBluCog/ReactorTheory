import crypto from 'crypto';

const WORM_LOG = [];
const MAX_MEMORY_EVENTS = 1000;

export const EVENT_TYPES = Object.freeze({
  PASS: 'PASS',
  SOFT_FRICTION: 'SOFT_FRICTION',
  HARD_BLOCK: 'HARD_BLOCK'
});

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function safeHash(value) {
  return sha256(String(value || 'unknown')).slice(0, 16);
}

export function appendWormEvent({ type, cid, route, reason = 'sealed', metadata = {} }) {
  const previous = WORM_LOG[WORM_LOG.length - 1];
  const event = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    type,
    cid_hash: safeHash(cid),
    route_hash: safeHash(route),
    reason,
    metadata,
    prev_hash: previous?.entry_hash || null
  };

  event.entry_hash = sha256(JSON.stringify(event));
  WORM_LOG.push(Object.freeze(event));

  if (WORM_LOG.length > MAX_MEMORY_EVENTS) {
    WORM_LOG.shift();
  }

  return event;
}

export function readWormEvents({ limit = 100 } = {}) {
  return WORM_LOG.slice(-limit).reverse();
}

export function summarizeWormEvents() {
  const summary = {
    total: WORM_LOG.length,
    PASS: 0,
    SOFT_FRICTION: 0,
    HARD_BLOCK: 0,
    latest_hash: WORM_LOG[WORM_LOG.length - 1]?.entry_hash || null
  };

  for (const event of WORM_LOG) {
    if (summary[event.type] !== undefined) summary[event.type] += 1;
  }

  return summary;
}
