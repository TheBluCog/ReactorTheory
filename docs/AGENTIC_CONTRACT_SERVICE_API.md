# Agentic Contract and Service API

**Framework:** RT9.1 / RT11 Governance Infrastructure  
**Status:** Published public interface draft  
**Purpose:** Define the public-facing service contract API for deterministic, auditable, policy-bound agentic execution.

---

## One-Line Thesis

**Agentic systems should not merely act. They should act under contract, policy, audit, and verifiable control.**

The Agentic Contract and Service API defines the interface between:

- a requesting user or system,
- an agentic execution service,
- a governance / policy layer,
- an audit ledger,
- and downstream tools or services.

---

## Core Principle

An agentic service call is not just an API request.

It is a governed contract event.

```text
REQUEST + POLICY + AUTHORITY + CONTEXT + EXECUTION + AUDIT = AGENTIC CONTRACT
```

The API exists to make that contract observable, repeatable, enforceable, and reviewable.

---

## System Roles

| Role | Meaning |
|---|---|
| Principal | Human, organization, or system requesting execution |
| Agent | Automated or semi-automated system performing work |
| Policy Engine | Determines whether execution is allowed, blocked, escalated, or modified |
| Contract Runtime | Binds request, authority, scope, and execution constraints |
| Service Adapter | Connects governed agent decisions to external tools or services |
| Audit Ledger | Records request, decision, execution, refusal, escalation, and evidence |
| Reviewer | Human or governance authority that can inspect, approve, or reject execution |

---

## Contract Object

Every governed execution should create or reference an Agentic Contract object.

```json
{
  "contract_id": "ac_000001",
  "version": "1.0.0",
  "principal": {
    "id": "principal_123",
    "type": "human|organization|system"
  },
  "agent": {
    "id": "agent_001",
    "type": "llm|workflow|service|hybrid"
  },
  "authority": {
    "scope": "read|write|execute|transact|publish",
    "delegation": "none|limited|full",
    "expires_at": "2026-12-31T23:59:59Z"
  },
  "policy": {
    "policy_id": "policy_rt91_default",
    "mode": "allow|deny|escalate|simulate",
    "risk_tier": "low|medium|high|critical"
  },
  "constraints": {
    "max_value_at_risk": 0,
    "requires_human_approval": true,
    "allowed_tools": [],
    "prohibited_actions": []
  },
  "audit": {
    "ledger_id": "ledger_001",
    "append_only": true,
    "evidence_required": true
  }
}
```

---

## Service API Endpoints

This is a public interface draft. Endpoint names are illustrative and may be implemented as REST, GraphQL, RPC, or event-driven services.

---

## 1. Create Contract

```http
POST /v1/agentic/contracts
```

Creates a governed execution contract.

### Request

```json
{
  "principal_id": "principal_123",
  "agent_id": "agent_001",
  "requested_scope": ["read", "write"],
  "purpose": "Prepare investor-facing materials",
  "constraints": {
    "requires_human_approval": true,
    "allowed_tools": ["github", "documents"],
    "prohibited_actions": ["send_funds", "execute_trade"]
  }
}
```

### Response

```json
{
  "contract_id": "ac_000001",
  "status": "created",
  "policy_state": "pending_validation"
}
```

---

## 2. Validate Contract

```http
POST /v1/agentic/contracts/{contract_id}/validate
```

Validates authority, scope, policy, risk, and required approval gates.

### Response

```json
{
  "contract_id": "ac_000001",
  "valid": true,
  "decision": "allowed_with_constraints",
  "required_controls": [
    "human_approval_before_publish",
    "audit_log_required"
  ]
}
```

---

## 3. Execute Service Call

```http
POST /v1/agentic/contracts/{contract_id}/execute
```

Executes an action under a validated contract.

### Request

```json
{
  "action": "update_repository_file",
  "target": "github://TheBluCog/ReactorTheory/docs/example.md",
  "input": {
    "change_summary": "Update public governance material"
  }
}
```

### Response

```json
{
  "execution_id": "exec_000001",
  "contract_id": "ac_000001",
  "status": "completed",
  "policy_decision": "allowed",
  "audit_event_id": "audit_000001"
}
```

---

## 4. Refuse or Escalate

```http
POST /v1/agentic/contracts/{contract_id}/decision
```

Records a refusal, escalation, or conditional approval.

### Request

```json
{
  "decision": "escalate",
  "reason": "Action exceeds delegated authority",
  "required_reviewer": "human_operator"
}
```

### Response

```json
{
  "contract_id": "ac_000001",
  "decision": "escalated",
  "execution_blocked": true
}
```

---

## 5. Audit Event

```http
POST /v1/agentic/audit/events
```

Appends a governance, decision, execution, or evidence event to the audit ledger.

### Request

```json
{
  "contract_id": "ac_000001",
  "execution_id": "exec_000001",
  "event_type": "policy_decision|execution|refusal|approval|evidence",
  "summary": "Policy approved repository update",
  "evidence": {
    "hash": "sha256:...",
    "uri": "github://commit/..."
  }
}
```

### Response

```json
{
  "audit_event_id": "audit_000001",
  "append_only": true,
  "timestamp": "2026-05-07T00:00:00Z"
}
```

---

## 6. Retrieve Contract State

```http
GET /v1/agentic/contracts/{contract_id}
```

Returns the current state of a contract.

### Response

```json
{
  "contract_id": "ac_000001",
  "status": "active",
  "validated": true,
  "executions": 3,
  "open_escalations": 0,
  "audit_events": 12
}
```

---

## 7. Revoke Contract

```http
POST /v1/agentic/contracts/{contract_id}/revoke
```

Revokes delegated authority.

### Request

```json
{
  "reason": "Operator revoked authority",
  "effective_immediately": true
}
```

### Response

```json
{
  "contract_id": "ac_000001",
  "status": "revoked",
  "future_execution_blocked": true
}
```

---

## Policy Decision States

| State | Meaning |
|---|---|
| allowed | Execution may proceed |
| allowed_with_constraints | Execution may proceed only with specified controls |
| denied | Execution is blocked |
| escalated | Human or higher authority review required |
| simulated | Dry-run only; no external write or binding action |
| revoked | Authority removed |

---

## Risk Tiers

| Tier | Meaning | Default Handling |
|---|---|---|
| Low | Reversible or informational action | Allow with audit |
| Medium | Limited external effect | Allow with constraints |
| High | Writes, publication, material business impact | Require explicit approval |
| Critical | Financial, legal, safety, identity, or irreversible action | Escalate or deny unless pre-authorized |

---

## Safety and Control Rules

Agentic services should fail closed when:

- contract authority is missing,
- requested action exceeds scope,
- identity cannot be verified,
- policy cannot be evaluated,
- audit logging is unavailable,
- required human approval is absent,
- action creates unauthorized financial, legal, safety, or operational risk.

```text
NO VALID CONTRACT → NO EXECUTION
NO POLICY DECISION → NO EXECUTION
NO AUDIT PATH → NO EXECUTION
```

---

## RT9.1 / RT11 Alignment

This API aligns with RT9.1 and RT11 governance principles:

- deterministic governance before execution,
- evidence-backed decisions,
- separation of authority and action,
- audit-grade accountability,
- human review for high-risk actions,
- refusal and escalation as first-class outcomes,
- no scale under drift.

---

## Reference Implementation Notes

A production implementation should include:

- signed contract objects,
- immutable audit events,
- policy version pinning,
- schema validation,
- replay protection,
- idempotency keys,
- tool allowlists,
- human approval workflows,
- event hashes,
- optional ledger anchoring,
- red-team refusal testing,
- administrative revocation controls.

---

## Public Interface Boundary

This document describes the public service API surface.

Private or restricted implementation details may include:

- proprietary policy DSL internals,
- scoring thresholds,
- model-specific enforcement logic,
- internal trust handshakes,
- security keys,
- private audit infrastructure,
- high-risk execution adapters.

Public rule:

```text
Show the contract surface.
Protect the enforcement internals.
```

---

## Final Position

Agentic systems need more than prompts.

They need contracts.

```text
A governed agent is not merely an AI that acts.
A governed agent is an AI whose authority, limits, decisions, and evidence can be inspected.
```

That is the purpose of the Agentic Contract and Service API.
