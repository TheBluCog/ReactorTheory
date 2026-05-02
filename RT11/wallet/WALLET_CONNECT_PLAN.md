# RT11 Wallet Connect + Real Payout Execution Plan

## Status

This is the production-safe wallet and payout integration plan for RT11.

The current RT11 UI is a simulation/prototype. Real payouts must be introduced behind strict safeguards.

## Canonical Treasury Wallet

```text
0x27f780E6d46dF69347f954674bbDF39924e3D644
```

## Required Safety Sequence

```text
1. Amoy testnet first
2. Contract verification
3. Multisig treasury ownership
4. Recipient allowlist
5. Dry-run payout report
6. Human approval
7. Live execution
8. On-chain audit export
```

## UI Requirements

The RT11 wallet panel should expose:

```text
Connect Wallet
Show Chain ID
Show Wallet Address
Show Treasury Contract Address
Show Current Treasury Balance
Dry Run Distribution
Generate Payout Preview
Execute Payouts — disabled unless safeguards pass
```

## Required Environment Variables

```bash
VITE_POLYGON_CHAIN_ID=137
VITE_AMOY_CHAIN_ID=80002
VITE_TREASURY_ROUTER_ADDRESS=
VITE_CRED_NFT_ADDRESS=
VITE_RESONANCE_ENGINE_ADDRESS=
```

## Execution Guardrails

Real payout execution should require:

- connected wallet matches authorized operator or multisig signer
- correct network selected
- payout recipients are allowlisted
- contract address is verified
- payout dry run hash matches final execution hash
- UI displays irreversible transaction warning
- user signs transaction explicitly

## Recommended Libraries

```text
wagmi
viem
@rainbow-me/rainbowkit
```

## Minimal Flow

```text
User connects wallet
→ UI checks chain
→ UI reads TreasuryRouter balance
→ UI builds recipient list
→ UI computes dry-run payout allocation
→ User approves payout
→ TreasuryRouter.distribute(recipients)
→ UI displays transaction hash
→ Audit log stores tx reference
```

## Rule

No real-money execution should run automatically. Every live transfer must be user-signed and human-approved.
