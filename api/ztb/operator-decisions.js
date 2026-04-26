import crypto from 'crypto';
import { appendWormEvent, EVENT_TYPES } from './audit.js';

const DECISIONS = [];

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function recordOperatorDecision({
  operator = 'unknown_operator',
  action,
  suggestion,
  note = '',
  approval_state
}) {
  const decision = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    operator_hash: sha256(operator).slice(0, 16),
    action,
    approval_state,
    note,
    suggestion_hash: sha256(JSON.stringify(suggestion || {})),
    suggestion,
    enforcement_change_applied: false,
    safety_rule: 'Operator decisions are logged. Enforcement changes require separate controlled deployment.'
  };

  decision.decision_hash = sha256(JSON.stringify(decision));
  DECISIONS.push(Object.freeze(decision));

  appendWormEvent({
    type: approval_state === 'APPROVED' ? EVENT_TYPES.PASS : EVENT_TYPES.SOFT_FRICTION,
    cid: operator,
    route: '/operator/decision',
    reason: `operator_${approval_state.toLowerCase()}`,
    metadata: [{
      severity: approval_state === 'APPROVED' ? 'INFO' : 'SOFT',
      class: `POLICY_SUGGESTION_${approval_state}`,
      detail: action
    }]
  });

  return decision;
}

export function readOperatorDecisions({ limit = 50 } = {}) {
  return DECISIONS.slice(-limit).reverse();
}
