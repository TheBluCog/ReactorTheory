# Resonance Engine Enterprise Open License (REEOL)

Version: 1.0
Effective Date: 2026-04-26

## 1. Purpose

This license governs the use of the Resonance Engine and RT9.1 Production framework in enterprise environments.

It is designed to enable broad adoption while protecting the integrity of the execution layer, preventing unauthorized replication, and preserving attribution rights.

## 2. Grant of Use

Permission is granted to use, evaluate, integrate, and deploy the public-facing aspects of RT9.1 and the Resonance Engine under the following conditions:

- Non-commercial, educational, and humanitarian use is free.
- Enterprise and commercial use requires attribution.
- Execution-layer access requires authorized integration.

## 3. Attribution Requirement

All implementations must include visible attribution:

"Powered by RT9.1 + Resonance Engine (Reactor Theory)"

## 4. Restricted Components

The following are NOT licensed for replication, reverse engineering, or redistribution:

- Server-side semantic resolver
- Execution-layer policy engine
- Capability token system
- Route derivation logic
- Drift / control evaluation internals
- Zero-trust enforcement logic

## 5. Zero-Trust Enforcement Clause

Use of the system requires adherence to the ZTB-NATOHEX-1.0 boundary.

Any attempt to bypass:

- Nonce validation
- Signature validation
- Capability validation
- Route hashing
- Boundary enforcement

results in immediate revocation of license.

## 6. Enterprise Integration

Enterprise deployments must:

- Use approved integration pathways
- Maintain audit logs
- Respect BLOCK / AUDIT / GOVERN states
- Avoid exposing internal system variables

## 7. No Warranty

The system is provided "as is" without warranty of any kind.

## 8. Liability Limitation

The authors are not liable for any damages arising from misuse, misconfiguration, or unauthorized deployment.

## 9. Governance

The framework may evolve. Updated versions of this license supersede prior versions.

## 10. Canon Statement

```text
LICENSE_TYPE: ENTERPRISE_OPEN
EXECUTION_LAYER: PROTECTED
CLIENT_ACCESS: CONDITIONAL
ATTRIBUTION: REQUIRED
BOUNDARY: ZERO_TRUST
```
