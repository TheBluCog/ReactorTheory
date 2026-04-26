import { adaptivePrediction, readAdaptiveModel } from './adaptive-learning.js';

const POLICY_ACTIONS = Object.freeze({
  MONITOR: 'MONITOR',
  TIGHTEN_TIMESTAMP_WINDOW: 'TIGHTEN_TIMESTAMP_WINDOW',
  REQUIRE_STEP_UP_AUTH: 'REQUIRE_STEP_UP_AUTH',
  INCREASE_RATE_LIMIT_STRICTNESS: 'INCREASE_RATE_LIMIT_STRICTNESS',
  ESCALATE_TO_HUMAN_REVIEW: 'ESCALATE_TO_HUMAN_REVIEW'
});

function suggestionForThreat(threat, risk) {
  if (!threat) {
    return {
      action: POLICY_ACTIONS.MONITOR,
      rationale: 'No dominant drift class detected.',
      operator_approval_required: true
    };
  }

  if (threat === 'TIMESTAMP_DRIFT') {
    return {
      action: POLICY_ACTIONS.TIGHTEN_TIMESTAMP_WINDOW,
      rationale: 'Repeated timestamp drift may indicate stale replay attempts, clock skew, or integration instability.',
      recommended_change: risk >= 0.72 ? 'Reduce soft window and require clock resync.' : 'Monitor clock drift and warn integrator.',
      operator_approval_required: true
    };
  }

  if (threat === 'REPLAY_ATTEMPT' || threat === 'SIGNATURE_FAILURE' || threat === 'ROUTE_MISMATCH') {
    return {
      action: POLICY_ACTIONS.REQUIRE_STEP_UP_AUTH,
      rationale: 'Credential, replay, or route-validation failures indicate possible boundary probing.',
      recommended_change: 'Require refreshed capability token and rotate deployment salt for affected client.',
      operator_approval_required: true
    };
  }

  if (threat === 'PAYLOAD_BLOAT') {
    return {
      action: POLICY_ACTIONS.INCREASE_RATE_LIMIT_STRICTNESS,
      rationale: 'Repeated large payloads may indicate probing, misuse, or malformed integration.',
      recommended_change: 'Lower payload threshold and add client-specific rate-limiting.',
      operator_approval_required: true
    };
  }

  return {
    action: POLICY_ACTIONS.ESCALATE_TO_HUMAN_REVIEW,
    rationale: `Recurring drift class ${threat} requires operator assessment before policy change.`,
    recommended_change: 'Open review ticket and preserve WORM evidence chain.',
    operator_approval_required: true
  };
}

export function generatePolicySuggestion(events = []) {
  const prediction = adaptivePrediction(events);
  const model = readAdaptiveModel();
  const threat = prediction.top_threat || prediction.threat || null;
  const risk = prediction.risk || 0;
  const base = suggestionForThreat(threat, risk);

  return {
    status: prediction.status,
    risk,
    top_threat: threat,
    suggestion: base,
    enforcement_change_applied: false,
    approval_state: 'PENDING_OPERATOR_REVIEW',
    safety_rule: 'Policy suggestions are advisory only. Enforcement rules must not change without explicit operator approval.',
    model_version: model.version,
    generated_at: new Date().toISOString()
  };
}

export function explainPolicySuggestion(suggestion) {
  if (!suggestion || suggestion.status === 'NOMINAL') {
    return 'Policy suggestion: monitor only. No elevated drift pattern requires policy change.';
  }

  return `Policy suggestion: ${suggestion.suggestion.action}. Dominant threat ${suggestion.top_threat}. Risk ${Math.round(suggestion.risk * 100)} percent. Operator approval required.`;
}
