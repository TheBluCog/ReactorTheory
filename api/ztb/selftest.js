import crypto from 'crypto';

const SECRET = 'dev_secret_change_me';

function hmac(data) {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

const payload = {
  cid: 'client1',
  nonce: 'abc123',
  ts: Date.now(),
  epoch: '2026Q2',
  payload: {
    ALPHA_7F3A: 'test'
  }
};

payload.proof = {
  sig: hmac(JSON.stringify(payload.payload) + payload.nonce + payload.ts)
};

console.log('Self-test payload:', payload);
