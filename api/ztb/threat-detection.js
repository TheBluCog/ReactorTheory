const SOFT_TIMESTAMP_DRIFT_MS = 15000;
const HARD_TIMESTAMP_DRIFT_MS = 30000;
const LARGE_PAYLOAD_BYTES = 16 * 1024;

export const THREAT_CLASSES = Object.freeze({
  NONE: 'NONE',
  TIMESTAMP_DRIFT: 'TIMESTAMP_DRIFT',
  PAYLOAD_BLOAT: 'PAYLOAD_BLOAT',
  UNKNOWN_SCHEMA: 'UNKNOWN_SCHEMA',
  DEBUG_ALIAS_LEAK: 'DEBUG_ALIAS_LEAK',
  SEMANTIC_LEAK_ATTEMPT: 'SEMANTIC_LEAK_ATTEMPT',
  REPLAY_ATTEMPT: 'REPLAY_ATTEMPT',
  SIGNATURE_FAILURE: 'SIGNATURE_FAILURE',
  ROUTE_MISMATCH: 'ROUTE_MISMATCH',
  MALFORMED_REQUEST: 'MALFORMED_REQUEST'
});

export function classifyThreat({ body, url, now = Date.now(), blockedTermsPresent = false, replayed = false, signatureFailed = false, routeMismatch = false }) {
  const findings = [];

  if (!body || !body.nonce || !body.ts || !body.proof) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.MALFORMED_REQUEST, detail: 'missing_required_boundary_fields' });
    return findings;
  }

  const drift = Math.abs(now - body.ts);
  if (drift > HARD_TIMESTAMP_DRIFT_MS) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.TIMESTAMP_DRIFT, detail: 'timestamp_outside_hard_window', drift_ms: drift });
  } else if (drift > SOFT_TIMESTAMP_DRIFT_MS) {
    findings.push({ severity: 'SOFT', class: THREAT_CLASSES.TIMESTAMP_DRIFT, detail: 'timestamp_near_expiry', drift_ms: drift });
  }

  const payloadSize = Buffer.byteLength(JSON.stringify(body.payload || {}), 'utf8');
  if (payloadSize > LARGE_PAYLOAD_BYTES) {
    findings.push({ severity: 'SOFT', class: THREAT_CLASSES.PAYLOAD_BLOAT, detail: 'payload_exceeds_soft_size_threshold', payload_bytes: payloadSize });
  }

  if (body.schema !== 'ZTB-NATOHEX-1.0') {
    findings.push({ severity: 'SOFT', class: THREAT_CLASSES.UNKNOWN_SCHEMA, detail: 'schema_not_current_boundary' });
  }

  if (body._debug_aliases) {
    findings.push({ severity: 'SOFT', class: THREAT_CLASSES.DEBUG_ALIAS_LEAK, detail: 'debug_alias_map_present_in_request' });
  }

  if (blockedTermsPresent) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.SEMANTIC_LEAK_ATTEMPT, detail: 'deprecated_plaintext_term_detected' });
  }

  if (replayed) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.REPLAY_ATTEMPT, detail: 'nonce_replay_detected' });
  }

  if (signatureFailed) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.SIGNATURE_FAILURE, detail: 'signature_validation_failed' });
  }

  if (routeMismatch) {
    findings.push({ severity: 'HARD', class: THREAT_CLASSES.ROUTE_MISMATCH, detail: 'salted_route_validation_failed' });
  }

  return findings;
}

export function hasHardThreat(findings) {
  return findings.some(f => f.severity === 'HARD');
}

export function hasSoftThreat(findings) {
  return findings.some(f => f.severity === 'SOFT');
}
