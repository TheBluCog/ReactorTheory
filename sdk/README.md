# ZTB Client SDK (RT9.1)

This SDK automatically:

- Obfuscates payload keys using NATO + Hex aliases
- Generates nonces per request
- Signs payloads (HMAC-SHA256)
- Derives salted route paths
- Prevents deprecated term leakage

## Install (local)

```bash
node sdk/ztb-client.js
```

## Usage

```js
import { ZtbClient } from './ztb-client.js';

const client = new ZtbClient({
  baseUrl: 'https://your-api.vercel.app',
  clientId: 'client1',
  secret: 'shared_secret'
});

const result = await client.execute({
  energy: 0.8,
  intent: 0.9,
  control: 0.7,
  drift: 0.2
});

console.log(result);
```

## Guarantees

- No internal variable names leave the client
- Payload is always rotated
- Each request is unique (nonce + timestamp)
- Signature required for execution

## Warning

Never expose your `secret` in public frontends. Use server-side proxy for browser clients.
