import crypto from 'crypto';
import { appendWormEvent, EVENT_TYPES } from './audit.js';

const POLICY_REGISTRY = [];
const DEPLOYMENTS = [];

const BASE_POLICY = Object.freeze({
  version: 'policy-rt9.1-0000',
  status: 'BASELINE',
  timestamp_window_ms: 30000,
  soft_timestamp_window_ms: 15000,
  payload_soft_limit_bytes: 16384,
  step_up_auth_required_for: [],
  rate_limit_profile: 'standard',
  deployment_salt_rotation_required: false
});

POLICY_REGISTRY.push(BASE_POLICY);

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function nextPolicyVersion() {
  return `policy-rt9.1-${String(POLICY_REGISTRY.length).padStart(4, '0')}`;
}

function currentPolicy() {
  return POLICY_REGISTRY[POLICY_REGISTRY.length - 1] || BASE_POLICY;
}

function derivePolicyPatch(action) {
  switch (action) {
    case 'TIGHTEN_TIMESTAMP_WINDOW':
      return {
        timestamp_window_ms: 20000,
        soft_timestamp_window_ms: 10000
      };
    case 'REQUIRE_STEP_UP_AUTH':
      return {
        step_up_auth_required_for: ['REPLAY_ATTEMPT', 'SIGNATURE_FAILURE', 'ROUTE_MISMATCH'],
        deployment_salt_rotation_required: true
      };
    case 'INCREASE_RATE_LIMIT_STRICTNESS':
      return {
        payload_soft_limit_bytes: 8192,
        rate_limit_profile: 'strict'
      };
    case 'ESCALATE_TO_HUMAN_REVIEW':
      return {
        rate_limit_profile: 'review_required'
      };
    case 'MONITOR':
    default:
      return {};
  }
}

export function stagePolicyFromSuggestion({ suggestion, operator = 'unknown_operator' }) {
  const active = currentPolicy();
  const action = suggestion?.suggestion?.action || suggestion?.action || 'MONITOR';
  const patch = derivePolicyPatch(action);
  const staged = {
    ...active,
    ...patch,
    version: nextPolicyVersion(),
    status: 'STAGED',
    staged_at: new Date().toISOString(),
    staged_by_hash: sha256(operator).slice(0, 16),
    source_suggestion_hash: sha256(JSON.stringify(suggestion || {})),
    enforcement_change_applied: false
  };
  staged.policy_hash = sha256(JSON.stringify(staged));
  POLICY_REGISTRY.push(Object.freeze(staged));

  appendWormEvent({
    type: EVENT_TYPES.SOFT_FRICTION,
    cid: operator,
    route: '/policy/stage',
    reason: 'policy_staged_pending_deployment',
    metadata: [{ severity: 'INFO', class: 'POLICY_STAGED', detail: action }]
  });

  return staged;
}

export function deployStagedPolicy({ version, operator = 'unknown_operator' }) {
  const policy = POLICY_REGISTRY.find(p => p.version === version);
  if (!policy) throw new Error('Policy version not found');
  if (policy.status !== 'STAGED') throw new Error('Only STAGED policies can be deployed');

  const deployed = {
    ...policy,
    status: 'DEPLOYED',
    deployed_at: new Date().toISOString(),
    deployed_by_hash: sha256(operator).slice(0, 16),
    enforcement_change_applied: true
  };
  deployed.policy_hash = sha256(JSON.stringify(deployed));

  POLICY_REGISTRY.push(Object.freeze(deployed));

  const deployment = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    operator_hash: sha256(operator).slice(0, 16),
    version: deployed.version,
    policy_hash: deployed.policy_hash,
    status: 'DEPLOYED'
  };
  deployment.deployment_hash = sha256(JSON.stringify(deployment));
  DEPLOYMENTS.push(Object.freeze(deployment));

  appendWormEvent({
    type: EVENT_TYPES.PASS,
    cid: operator,
    route: '/policy/deploy',
    reason: 'policy_deployed',
    metadata: [{ severity: 'INFO', class: 'POLICY_DEPLOYED', detail: deployed.version }]
  });

  return { policy: deployed, deployment };
}

export function rollbackPolicy({ operator = 'unknown_operator' }) {
  const deployed = [...POLICY_REGISTRY].reverse().filter(p => p.status === 'DEPLOYED');
  const previous = deployed[1] || BASE_POLICY;
  const rollback = {
    ...previous,
    version: nextPolicyVersion(),
    status: 'DEPLOYED',
    rollback_at: new Date().toISOString(),
    rolled_back_by_hash: sha256(operator).slice(0, 16),
    enforcement_change_applied: true
  };
  rollback.policy_hash = sha256(JSON.stringify(rollback));
  POLICY_REGISTRY.push(Object.freeze(rollback));

  appendWormEvent({
    type: EVENT_TYPES.SOFT_FRICTION,
    cid: operator,
    route: '/policy/rollback',
    reason: 'policy_rollback',
    metadata: [{ severity: 'INFO', class: 'POLICY_ROLLBACK', detail: rollback.version }]
  });

  return rollback;
}

export function readPolicyRegistry({ limit = 50 } = {}) {
  return POLICY_REGISTRY.slice(-limit).reverse();
}

export function readDeployments({ limit = 50 } = {}) {
  return DEPLOYMENTS.slice(-limit).reverse();
}

export function getActivePolicy() {
  return [...POLICY_REGISTRY].reverse().find(p => p.status === 'DEPLOYED') || BASE_POLICY;
}
