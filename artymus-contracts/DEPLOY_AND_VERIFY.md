# ARTYMUS Contract Deploy + Verify Walkthrough

This guide deploys the ARTYMUSReceiptAnchor contract and verifies anchored receipts.

---

## 1. Prerequisites

Install Node.js 18+ and prepare a funded Polygon wallet.

For testnet, use Polygon Amoy. For production, use Polygon mainnet.

Never commit `.env` files or private keys.

---

## 2. Configure Environment

Create:

```bash
artymus-contracts/.env
```

With:

```bash
PRIVATE_KEY=your_wallet_private_key_without_0x
POLYGON_RPC_URL=https://polygon-rpc.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=optional_for_contract_verification
```

---

## 3. Install Dependencies

```bash
cd artymus-contracts
npm install
```

---

## 4. Compile

```bash
npm run compile
```

---

## 5. Deploy to Amoy Testnet

```bash
npm run deploy:amoy
```

Expected output:

```text
ARTYMUSReceiptAnchor deployed to: 0x...
```

Save the address.

---

## 6. Deploy to Polygon Mainnet

```bash
npm run deploy:polygon
```

Save the contract address.

---

## 7. Configure API Auto-Anchoring

Set these environment variables in the server deployment environment:

```bash
PRIVATE_KEY=your_wallet_private_key_without_0x
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0xYourDeployedContractAddress
AUTO_ANCHOR=true
```

---

## 8. Verify a Receipt

Receipt verification requires:

1. receipt body
2. receipt digest
3. contract address
4. network

Use the verifier UI:

```text
artymus/verify/ui/index.html
```

Or call the contract directly:

```solidity
verifyReceipt(bytes32 receiptDigest)
```

---

## 9. Security Rules

- Store only receipt digests on-chain.
- Never store private user data on-chain.
- Never expose private keys in browser code.
- Use a dedicated low-balance anchoring wallet.
- Use testnet first.

---

## 10. Operational Flow

```text
API request
  → RT9.1 preflight decision
  → audit receipt
  → SHA256 digest
  → ARTYMUSReceiptAnchor.anchorReceipt(...)
  → transaction hash
  → receipt.anchor
  → verifier UI
```
