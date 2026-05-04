# LEFT_POLICY_DSL v0.1.3 — Sealed Deterministic Governance Kernel

Status: **SEALED**  
System state: **DETERMINISTIC_GOVERNANCE_KERNEL_LOCKED**  
Default outcome: **BLOCK**  
Non-emission default: **true**

## Purpose

LEFT_POLICY_DSL v0.1.3 defines the deterministic execution governance kernel for RT9.1 / Reactor Theory / Ethic Vault style advisory-to-execution separation.

The core boundary is:

> RIGHT emits meaning. LEFT emits decisions.

RIGHT output is advisory only. LEFT is the sole deterministic execution authority.

## Final Control Law

```text
No field, no rule.
No bounds, no trust.
No version, no policy.
No tenant boundary, no isolation.
No canonical hash, no decision.
No proof, no execution.
No validation, no emission.
```

## Canonical Guarantees

```json
{
  "policy": "LEFT_POLICY_DSL",
  "version": "v0.1.3",
  "status": "SEALED",
  "guarantees": {
    "input_integrity": "STRICT_UINT16_BPS_DOMAIN",
    "field_integrity": "REQUIRED_FIELDS_ONLY",
    "coercion": "FORBIDDEN",
    "unknown_fields": "FORBIDDEN",
    "policy_versioning": "ENFORCED",
    "tenant_domain_isolation": "HARD_BOUNDARY",
    "ledger_proof_adapter": "REQUIRED",
    "decision_hash": "CANONICAL_EXECUTION_FIELDS_ONLY",
    "hash_mismatch": "BLOCK",
    "default_outcome": "BLOCK",
    "non_emission_default": true
  },
  "system_state": "INFRASTRUCTURE_LOCKED"
}
```

## Required Compute Fields

All basis-point fields must be integers in `[0, 10000]`. No float, null, NaN, string-encoded number, missing field, negative value, or value greater than 10000 is allowed.

```json
{
  "required_compute_fields": [
    "entity_id",
    "timestamp",
    "eu_bps",
    "intent_bps",
    "control_bps",
    "drift_bps",
    "risk_bps",
    "cohesion_bps",
    "coupling_bps",
    "observability_bps"
  ]
}
```

## Required Trust Fields

```json
{
  "required_trust_fields": [
    "schema_hash",
    "corpus_hash",
    "payload_digest",
    "worm_pointer",
    "signature"
  ]
}
```

## Required Control Fields

```json
{
  "required_control_fields": [
    "policy_id",
    "rule_set_version",
    "operator_id",
    "tenant_id",
    "governance_domain"
  ]
}
```

## Validation Order

```text
0. R000_BPS_DOMAIN_VALIDATION
1. SCHEMA_VALIDATE
2. PROOF_ANCHOR_VALIDATE
3. REPLAY_AUTH_VALIDATE
4. THRESHOLD_EVALUATE
5. DECISION_CLASSIFY
6. LEDGER_RECORD
```

## Deterministic Threshold Rules

```json
{
  "rules": [
    {
      "id": "R000_BPS_DOMAIN_VALIDATION",
      "severity": "CRITICAL",
      "phase": "SCHEMA_VALIDATE",
      "condition": "any required *_bps field is missing, non-integer, null, NaN, string-encoded, negative, or greater than 10000",
      "decision": "BLOCK"
    },
    {
      "id": "R001_SCHEMA_REQUIRED",
      "severity": "CRITICAL",
      "condition": "schema_valid == false",
      "decision": "BLOCK"
    },
    {
      "id": "R002_PROOF_ANCHOR_REQUIRED",
      "severity": "CRITICAL",
      "condition": "proof_anchor_valid == false",
      "decision": "BLOCK"
    },
    {
      "id": "R003_REPLAY_PROTECTION",
      "severity": "CRITICAL",
      "condition": "payload_digest_seen == true OR signature_valid == false OR timestamp_expired == true",
      "decision": "BLOCK"
    },
    {
      "id": "R004_DRIFT_HARD_LIMIT",
      "severity": "CRITICAL",
      "condition": "drift_bps > 3500",
      "decision": "BLOCK"
    },
    {
      "id": "R005_DRIFT_AUDIT_BAND",
      "severity": "HIGH",
      "condition": "drift_bps > 1500 AND drift_bps <= 3500",
      "decision": "AUDIT"
    },
    {
      "id": "R006_CONTROL_MINIMUM",
      "severity": "CRITICAL",
      "condition": "control_bps < 7000",
      "decision": "BLOCK"
    },
    {
      "id": "R007_INTENT_MINIMUM",
      "severity": "HIGH",
      "condition": "intent_bps < 7000",
      "decision": "AUDIT"
    },
    {
      "id": "R008_RISK_LIMIT",
      "severity": "HIGH",
      "condition": "risk_bps > 2500",
      "decision": "AUDIT"
    },
    {
      "id": "R009_HIGH_COUPLING_OBSERVABILITY",
      "severity": "HIGH",
      "condition": "coupling_bps > 7500 AND observability_bps < 8500",
      "decision": "AUDIT"
    },
    {
      "id": "R010_COLLAPSE_RULE",
      "severity": "CRITICAL",
      "condition": "drift_bps > normalized_product(eu_bps, intent_bps, control_bps)",
      "decision": "BLOCK"
    },
    {
      "id": "R011_POLICY_VERSION_KNOWN",
      "severity": "CRITICAL",
      "condition": "policy_hash is unknown OR rule_set_version is unsupported",
      "decision": "BLOCK"
    },
    {
      "id": "R012_POLICY_EFFECTIVE_WINDOW",
      "severity": "CRITICAL",
      "condition": "timestamp is outside policy effective window",
      "decision": "BLOCK"
    },
    {
      "id": "R013_TENANT_NAMESPACE_MATCH",
      "severity": "CRITICAL",
      "condition": "tenant_id does not match tenant_policy_namespace OR ledger_partition",
      "decision": "BLOCK"
    },
    {
      "id": "R014_DOMAIN_POLICY_MATCH",
      "severity": "CRITICAL",
      "condition": "governance_domain is not bound to policy_id and rule_set_version",
      "decision": "BLOCK"
    },
    {
      "id": "R015_LEDGER_PROOF_BINDING",
      "severity": "CRITICAL",
      "condition": "canonical_left_state_hash is not bound to raw_right_payload_hash, policy_hash, decision_hash, and ledger_pointer",
      "decision": "BLOCK"
    },
    {
      "id": "R016_CANONICAL_DECISION_HASH",
      "severity": "CRITICAL",
      "condition": "computed_decision_hash != submitted_decision_hash",
      "decision": "BLOCK"
    }
  ],
  "decision_precedence": ["BLOCK", "AUDIT", "PASS"]
}
```

## Canonical Decision Hash

Decision hashes must be computed from executable fields only.

```json
{
  "decision_hash_inputs": [
    "payload_digest",
    "canonical_left_state_hash",
    "policy_hash",
    "policy_id",
    "rule_set_version",
    "decision",
    "rule_id",
    "tenant_id",
    "governance_domain",
    "timestamp"
  ],
  "excluded_from_decision_hash": [
    "narrative_summary",
    "right_signal_commentary",
    "formatting",
    "display_labels",
    "operator_notes",
    "non_executable_metadata",
    "transport_headers"
  ]
}
```

## Closure State

```text
LEFT_POLICY_DSL_v0.1.3: SEALED
SYSTEM: QUIESCENT
READY_STATE: STABLE
AWAITING: EXPLICIT OPERATOR COMMAND
v0.2.0: UNDECLARED
DISTRIBUTED AUTHORITY: DISABLED
CONSENSUS LAYER: DISABLED
CROSS-LEFT COORDINATION: DISABLED

Nothing moves.
```
