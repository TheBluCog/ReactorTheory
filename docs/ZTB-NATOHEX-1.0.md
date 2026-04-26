# ZTB-NATOHEX-1.0 — Zero-Trust API Boundary

Status: LOCKED
Effective: 2026-04-26
Purpose: Deprecate all V1.1 client-facing terminology and replace it with an opaque NATO + Hex transport boundary.

## 1. Burn Notice

The following terms are deprecated from client-facing schemas, endpoints, SDKs, demo materials, pitch artifacts, and integration examples:

- RT8
- Intent Lattice
- y_base
- UAP
- state_seed
- operator_scope
- boundary_state
- internal_energy_vector
- internal_alignment_vector
- internal_coherence_vector
- internal_drift_vector

These terms may exist only inside sealed server-side implementation notes or private operator documentation. They must not appear in client payloads, public examples, route names, SDK fields, browser code, or deployable client configuration.

## 2. Core Rule

Clients send envelopes. The server owns meaning. Execution requires proof.

A stolen schema, leaked deck, or copied JSON payload must be a dead artifact unless it is paired with a valid cryptographic session, current epoch, nonce, capability, and server-side route derivation.

## 3. NATO + Hex Envelope

All client-facing payloads must use opaque NATO + Hex aliases.

```json
{
  "schema": "ZTB-NATOHEX-1.0",
  "epoch": "2026Q2",
  "cid": "client_hash",
  "nonce": "base64url_256bit",
  "ts": 1777210000,
  "callsign": "ALPHA-7F3A",
  "payload": {
    "ALPHA_7F3A": "...",
    "BRAVO_C91E": "...",
    "CHARLIE_4A0D": "...",
    "DELTA_EE12": "...",
    "ECHO_91B7": "...",
    "FOXTROT_0C8A": "..."
  },
  "proof": {
    "kid": "deployment_key_id",
    "alg": "HMAC-SHA256",
    "sig": "request_signature"
  }
}
```

## 4. Server-Only Semantic Resolver

The semantic resolver must never be shipped to client environments.

```json
{
  "ALPHA_7F3A": "server_internal_01",
  "BRAVO_C91E": "server_internal_02",
  "CHARLIE_4A0D": "server_internal_03",
  "DELTA_EE12": "server_internal_04",
  "ECHO_91B7": "server_internal_05",
  "FOXTROT_0C8A": "server_internal_06"
}
```

## 5. Salted Route Derivation

No stable semantic route names are permitted.

```text
route_id = HMAC_SHA256(server_secret, client_id + capability + epoch + deployment_salt)
```

Example public routes:

```text
/ztb/ALPHA/7f3a
/ztb/BRAVO/c91e
/ztb/CHARLIE/4a0d
```

## 6. Required Request Gate

Every request must pass:

1. TLS and mTLS where available.
2. Client identity validation.
3. Nonce freshness validation.
4. Timestamp window validation.
5. Signature verification.
6. Capability-token validation.
7. Schema hash validation.
8. Salted route validation.
9. Server-side semantic resolution.
10. Execution policy validation.

## 7. Hard Block Rule

```text
IF missing_signature
OR replayed_nonce
OR stale_timestamp
OR invalid_capability
OR unknown_schema_hash
OR unsalted_route
OR plaintext_deprecated_term_detected
THEN BLOCK
```

Blocked requests must return a generic denial only. Do not reveal which validation failed.

## 8. Enterprise Demo Lock

For Chris Froggatt and all enterprise demos:

- Show NATO + Hex only.
- Do not expose internal variable names.
- Do not expose formulas.
- Do not expose semantic routes.
- Do not expose resolver tables.
- Do not reuse demo payloads across clients.
- Rotate aliases per client, epoch, and deployment salt.

## 9. Status

ZTB-NATOHEX-1.0 is the active integration boundary. V1.1 terminology is burned from active client-facing integration design.
