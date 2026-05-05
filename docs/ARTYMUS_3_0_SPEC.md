# ARTYMUS 3.0 Specification

**Status:** Published canonical specification  
**Version:** 3.0.1  
**Date:** May 2026  
**Repository:** TheBluCog/ReactorTheory

---

## Executive Summary

ARTYMUS 3.0 is a layered intelligence, art-advisory, and governance runtime that separates public perception from private intelligence and governed execution.

The system is designed around one core doctrine:

```text
Public sees beauty.
Advisors see structure.
Operators see power.
```

ARTYMUS 3.0 combines:

- Shauna Lee Lange's art-world surface and valuation language;
- Maybe Art Consultancy as the public-facing perception layer;
- RT11 / Resonance Engine as the hidden intelligence substrate;
- Zero Trust authentication and adaptive access;
- trust scoring, risk scoring, anomaly detection, audit logging, and auto-defense;
- autonomous command mode, self-governing runtime, and distributed/global governance nodes.

---

## 1. System Model

```text
Surface        -> Perception
Substrate      -> Intelligence
Execution      -> ARTYMUS
Governance     -> Runtime
Network        -> Distributed Consensus
```

### Layer Summary

| Layer | Public Name | Function |
|---|---|---|
| Surface | Maybe / Shauna Lee Lange | Art-world trust, rarity, and perception |
| Intelligence | RT11 / Resonance Engine | Valuation coherence, trust, risk, and signal logic |
| Execution | ARTYMUS | Operator console, command interface, governed action |
| Governance | Runtime Stack | Auth, audit, anomaly, trust, risk, defense, autonomous loops |
| Network | Distributed Governance | Node registry, consensus, global sync |

---

## 2. Brand and Link Anchors

```text
Professional Art -> https://www.instagram.com/shaunaleelangeart
NPC / Company    -> https://www.yourNPC.art
```

Professional art references must route to Shauna Lee Lange's professional art identity.

NPC/company references must route to yourNPC.art.

Do not collapse these identities unless the asset explicitly intends to connect both brands.

---

## 3. Access Doctrine

```text
Collector -> feels
Advisor   -> interprets
Operator  -> acts
```

### Collector

- Sees surface layer.
- No formula first.
- No execution controls.
- Emotional certainty before mechanics.

### Advisor

- Sees valuation coherence.
- Sees signal mapping.
- Sees structured art-market interpretation.

### Operator

- Sees control room.
- Sees command layer.
- Sees trust, risk, defense, execution, and runtime state.

---

## 4. Valuation Coherence

ARTYMUS maps Shauna's art valuation language into RT11 signal language.

| Shauna Language | ARTYMUS / RT11 Language |
|---|---|
| Authorship | Identity |
| Provenance | Evidence |
| Liquidity | Demand |
| Condition | Control |
| Timing | Drift |

Core formula:

```text
Valuation Coherence = (Identity × Evidence × Demand × Control) / Drift
```

---

## 5. Published UI Surfaces

### Shauna Operator Login

```text
/ui/shauna-operator-login.html
```

Purpose: private threshold into the operator system.

### Shauna Operator App

```text
/ui/shauna-operator-app.html
```

Purpose: simplified post-login operator console.

### ARTYMUS Control Room

```text
/ui/artymus-control-room.html
```

Purpose: visible Trust + Risk + Defense control surface.

### ARTYMUS Command Layer

```text
/ui/artymus-command-layer.html
```

Purpose: operator command interface.

---

## 6. Authentication and Zero Trust

ARTYMUS 3.0 uses role-aware session logic with short-lived sessions and contextual binding.

Security features:

- signed/session-scoped access token or cookie depending on runtime profile;
- role and access level;
- session expiration;
- session binding to request context when enabled;
- nonce support when enabled;
- role hierarchy;
- adaptive permissions.

Role hierarchy:

```text
collector < advisor < operator
```

---

## 7. Runtime Intelligence Modules

### Audit

Tracks who did what, when, where, and with what result.

### Alerts

Triggers warning/critical notifications.

### Anomaly Detection

Detects repeated denied access and operator-level events.

### Behavior Model

Builds user behavior profiles.

### Trust Engine

Converts role, behavior, anomaly, and session health into dynamic trust.

### Risk Engine

Evaluates intent before action.

### Auto Defense

Enforces allow, restrict, reauth, or quarantine.

---

## 8. Consolidated API Runtime

ARTYMUS 3.0.1 consolidates the runtime API into a single Hobby-plan-safe Vercel serverless function:

```text
/api/artymus
```

Actions are selected by query string or body field:

```text
/api/artymus?action=auth
/api/artymus?action=protected-example
/api/artymus?action=command
/api/artymus?action=autonomous
/api/artymus?action=governor
/api/artymus?action=runtime-state
/api/artymus?action=runtime-loop
/api/artymus?action=governance-loop
/api/artymus?action=live-loop
/api/artymus?action=distributed-node
/api/artymus?action=distributed-consensus
/api/artymus?action=global-node
/api/artymus?action=global-sync
```

This consolidation prevents exceeding the Vercel Hobby plan limit of 12 serverless functions while retaining the same logical runtime capabilities.

Legacy route files under `/api/artymus/*` are considered implementation archive / migration artifacts and should not be treated as the canonical public API surface.

---

## 9. Command and Autonomous System

### Command Engine

Canonical route:

```text
/api/artymus?action=command
```

Processes explicit commands and natural-language-style inputs into system actions.

Supported command examples:

```text
TRUST.STATUS
RISK.CHECK
DEFENSE.STATUS
INTEL.OPEN
RT11.CONSOLE
SESSION.LOCK
```

### Autonomous Engine

Canonical route:

```text
/api/artymus?action=autonomous
```

Modes:

```text
observe
assist
execute-safe
```

The system may execute only when trust is sufficient, risk is acceptable, reauth is not required, and human approval is not required.

### Governor

Canonical route:

```text
/api/artymus?action=governor
```

Final decision authority for intent, trust, risk, and directives.

---

## 10. Runtime Loop

### Runtime State

```text
/api/artymus?action=runtime-state
```

Maintains serverless-safe runtime state snapshots.

### Runtime Loop

```text
/api/artymus?action=runtime-loop
```

Runs iterative trust/risk/decision cycles.

### Governance Loop

```text
/api/artymus?action=governance-loop
```

Simulates continuous system decision evolution.

### Live Loop

```text
/api/artymus?action=live-loop
```

Runs a serverless-safe loop simulation with trust and risk evolution.

---

## 11. Distributed Governance

### Distributed Node Registry

```text
/api/artymus?action=distributed-node
```

Allows independent nodes to submit signals, trust, risk, and votes.

### Distributed Consensus

```text
/api/artymus?action=distributed-consensus
```

Calculates network-level allow/deny/abstain consensus.

### Global Node Registry

```text
/api/artymus?action=global-node
```

Registers global governance nodes across systems, regions, and organizations.

### Global Sync

```text
/api/artymus?action=global-sync
```

Aggregates global network trust, risk, and health.

---

## 12. Operating Principles

1. Beauty first, mechanics later.
2. No execution without trust.
3. No trust without behavior.
4. No behavior without audit.
5. No autonomy without risk evaluation.
6. No governance without visibility.
7. No distributed system without consensus.
8. No serverless sprawl when a consolidated runtime router is sufficient.

---

## 13. Deployment Target

Primary target:

```text
https://reactor-theory.vercel.app
```

Preview target example:

```text
https://reactor-theory-5d2j6wahn-theblucogs-projects.vercel.app
```

---

## 14. Current Status

```text
Surface UI             COMPLETE
Operator login         COMPLETE
Operator app           COMPLETE
Control room           COMPLETE
Command layer          COMPLETE
Consolidated API       COMPLETE
Auth                   DEPLOY-SAFE / CONSOLIDATED
Audit                  CONSOLIDATED
Alerts                 CONSOLIDATED LOGIC
Anomaly detection      CONSOLIDATED LOGIC
Behavior model         CONSOLIDATED LOGIC
Trust scoring          CONSOLIDATED LOGIC
Risk engine            CONSOLIDATED LOGIC
Auto defense           CONSOLIDATED LOGIC
Autonomous engine      CONSOLIDATED
Governor               CONSOLIDATED
Runtime state          CONSOLIDATED
Runtime loop           CONSOLIDATED
Distributed governance CONSOLIDATED
Global network         CONSOLIDATED
```

---

## 15. Canonical Summary

ARTYMUS 3.0 is not a dashboard.

It is a private intelligence runtime that presents as art, reasons as governance, and executes only through controlled trust.

```text
Art is the surface.
Trust is the gate.
Risk is the judge.
Defense is the boundary.
Runtime is the memory.
Consensus is the network.
```

ARTYMUS 3.0.1 adds a deploy-safe consolidated API architecture for Vercel Hobby compatibility while preserving the full logical system model.
