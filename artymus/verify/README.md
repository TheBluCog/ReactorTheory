# ARTYMUS Verification Layer

This module defines how to verify an ARTYMUS audit receipt against:

1. Local receipt recomputation
2. Stored digest
3. Polygon smart contract anchor

---

## Verification Steps

1. Recompute receipt digest from receipt body
2. Compare with stored digest
3. Query contract:
   verifyReceipt(receiptDigest)
4. Validate:
   - exists == true
   - ethicVaultAnchor matches canonical hash
   - timestamp is valid

---

## Example (pseudo)

```js
const recomputed = sha256(receiptBody);
assert(recomputed === receipt.digest);

const onchain = contract.verifyReceipt(recomputed);
assert(onchain.exists === true);
assert(onchain.ethicVaultAnchor === CANON_HASH);
```

---

## Outcome

A verified receipt proves:
- the decision existed
- it was not altered
- it is anchored to Ethic Vault
- it is externally verifiable

