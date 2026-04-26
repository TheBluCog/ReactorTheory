import crypto from 'crypto';

const NATO = [
  'ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT',
  'GOLF', 'HOTEL', 'INDIA', 'JULIET', 'KILO', 'LIMA',
  'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO',
  'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY', 'XRAY',
  'YANKEE', 'ZULU'
];

const BLOCKED_TERMS = [
  'RT8',
  'Intent Lattice',
  'y_base',
  'UAP',
  'state_seed',
  'operator_scope',
  'boundary_state'
];

function hmac(secret, data) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function randomHex(bytes = 2) {
  return crypto.randomBytes(bytes).toString('hex').toUpperCase();
}

function nonce() {
  return crypto.randomBytes(32).toString('base64url');
}

function containsBlockedTerms(value) {
  const str = JSON.stringify(value);
  return BLOCKED_TERMS.some(term => str.includes(term));
}

function makeAlias(index) {
  const word = NATO[index % NATO.length];
  return `${word}_${randomHex(2)}`;
}

export class ZtbClient {
  constructor({ baseUrl, clientId, secret, epoch = '2026Q2', capability = 'exec' }) {
    if (!baseUrl || !clientId || !secret) {
      throw new Error('baseUrl, clientId, and secret are required');
    }

    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.clientId = clientId;
    this.secret = secret;
    this.epoch = epoch;
    this.capability = capability;
  }

  rotatePayload(input) {
    if (containsBlockedTerms(input)) {
      throw new Error('Blocked deprecated term detected in client payload');
    }

    const aliases = {};
    const payload = {};
    Object.entries(input).forEach(([key, value], index) => {
      const alias = makeAlias(index);
      aliases[key] = alias;
      payload[alias] = value;
    });

    return { payload, aliases };
  }

  deriveRoute() {
    return hmac(this.secret, this.clientId + this.capability + this.epoch).slice(0, 8);
  }

  buildEnvelope(input) {
    const rotated = this.rotatePayload(input);
    const ts = Date.now();
    const requestNonce = nonce();
    const sig = hmac(this.secret, JSON.stringify(rotated.payload) + requestNonce + ts);

    return {
      schema: 'ZTB-NATOHEX-1.0',
      epoch: this.epoch,
      cid: this.clientId,
      nonce: requestNonce,
      ts,
      callsign: Object.keys(rotated.payload)[0]?.replace('_', '-') || 'ALPHA-0000',
      payload: rotated.payload,
      proof: {
        kid: `${this.clientId}:${this.epoch}`,
        alg: 'HMAC-SHA256',
        sig
      },
      _debug_aliases: rotated.aliases
    };
  }

  async execute(input, fetchImpl = fetch) {
    const envelope = this.buildEnvelope(input);
    const route = this.deriveRoute();
    const url = `${this.baseUrl}/ztb/${envelope.callsign}/${route}`;

    const res = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ztb-schema': 'ZTB-NATOHEX-1.0',
        'x-ztb-epoch': this.epoch
      },
      body: JSON.stringify(envelope)
    });

    return {
      ok: res.ok,
      status: res.status,
      body: await res.json().catch(() => ({})),
      envelope
    };
  }
}

export default ZtbClient;
