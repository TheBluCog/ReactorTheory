# Reactor Theory Deployed App

## Purpose

This page documents the deployed Reactor Theory reference app and its alignment to the live Ethic Vault Core / ReactorCore governance diagnostics.

## Deployed App

- Reactor Theory app: https://reactor-theory.vercel.app
- ReactorCore app: https://reactorcore.vercel.app
- EthicsVaultCore app: https://ethicsvaultcore.vercel.app
- Ethics Vault Core Vercel target: https://ethicsvaultcore-ethics-vault.vercel.app

## Live Governance Test Links

### Primary Diagnostics

- Deploy status: https://ethicsvaultcore.vercel.app/api/deploy-status
- System state: https://ethicsvaultcore.vercel.app/api/system

### Ethics Vault Core

- Homepage: https://ethicsvaultcore-ethics-vault.vercel.app/
- Health: https://ethicsvaultcore-ethics-vault.vercel.app/api/system?action=health
- Governance: https://ethicsvaultcore-ethics-vault.vercel.app/api/system
- GitHub callback diagnostic: https://ethicsvaultcore-ethics-vault.vercel.app/api/auth/callback/github?code=diagnostic
- Deploy status: https://ethicsvaultcore-ethics-vault.vercel.app/api/deploy-status

### Reactor Core

- Homepage: https://reactorcore.vercel.app/
- Health: https://reactorcore.vercel.app/api/system?action=health
- Governance: https://reactorcore.vercel.app/api/system
- GitHub callback diagnostic: https://reactorcore.vercel.app/api/auth/callback/github?code=diagnostic
- Deploy status: https://reactorcore.vercel.app/api/deploy-status

## Latest Confirmed Runtime State

The deployed diagnostics confirmed:

- Total systems: 2
- Ready: 2
- Degraded: 0
- Down: 0
- ethicsvaultcore: READY
- reactorcore: READY

Observed governance state:

- Decision: AUDIT
- Policy allowed: true
- Risk: LOW
- UAP: 56
- E: 92
- I: 88
- C: 84
- D: 0.18

## Reactor Theory Mapping

The deployed app represents Reactor Theory as an operational reference surface.

The live governance systems operationalize the RT9 stack:

```text
State → Intent → Control → Drift → UAP → Decision → Audit
```

Core formula:

```text
UAP = (E × I × C) / D
```

Where:

- E = Energy / capability
- I = Intent alignment
- C = Control / coherence
- D = Drift / entropy

## Deployment Interpretation

A `READY` system means:

- endpoint is reachable
- health check passes
- governance check passes
- GitHub callback diagnostic route is reachable
- deployment provider is Vercel
- runtime is Vercel serverless
- failureHint is null

## Test Commands

```bash
curl -L -f "https://ethicsvaultcore.vercel.app/api/deploy-status"
curl -L -f "https://ethicsvaultcore.vercel.app/api/system"
curl -L -f "https://reactorcore.vercel.app/api/system?action=health"
curl -L -f "https://ethicsvaultcore-ethics-vault.vercel.app/api/system?action=health"
```

## Public / Private Boundary

Public:

- deployed app URLs
- endpoint URLs
- readiness states
- governance outcomes
- manual test commands
- public diagnostics

Private:

- Canon Definition Language full grammar
- Phi-Invariant Boundary threshold computation
- Golden Dataset schema
- Zero Trust Inference scoring internals
- Agentic Contract API internal handshake

## Canonical Summary

The Reactor Theory deployed app is the public reference layer.
Ethic Vault Core and ReactorCore are the operational governance diagnostics layer.
Together they show Reactor Theory moving from conceptual model to deployable governance control plane.