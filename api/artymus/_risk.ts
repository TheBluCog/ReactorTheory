import type { TrustScore } from './_trust';

export type RiskAction = 'view' | 'score' | 'advise' | 'execute' | 'admin';

export type RiskInput = {
  action: RiskAction;
  trust: TrustScore;
  role?: string;
  level?: number;
  amountUsd?: number;
  anomalyRisk?: number;
  drift?: number;
  confidence?: number;
};

export type RiskDecision = {
  allow: boolean;
  requireReauth: boolean;
  requireHumanApproval: boolean;
  risk: number;
  band: 'low' | 'medium' | 'high' | 'critical';
  reason: string[];
};

const ACTION_WEIGHT: Record<RiskAction, number> = {
  view: 5,
  score: 12,
  advise: 22,
  execute: 45,
  admin: 55,
};

export function evaluateRisk(input: RiskInput): RiskDecision {
  const reason: string[] = [];
  let risk = ACTION_WEIGHT[input.action];

  risk += Math.max(0, 100 - input.trust.score) * 0.45;

  if ((input.level || 0) < 2 && ['advise', 'execute', 'admin'].includes(input.action)) {
    risk += 35;
    reason.push('role-below-advisory-threshold');
  }

  if ((input.level || 0) < 3 && ['execute', 'admin'].includes(input.action)) {
    risk += 45;
    reason.push('operator-required');
  }

  if (input.amountUsd && input.amountUsd > 10000) {
    risk += Math.min(35, Math.log10(input.amountUsd) * 6);
    reason.push('financial-exposure');
  }

  if ((input.anomalyRisk || 0) > 0) {
    risk += Math.min(35, input.anomalyRisk || 0);
    reason.push('anomaly-risk');
  }

  if ((input.drift || 0) > 50) {
    risk += 20;
    reason.push('high-drift');
  }

  if (input.confidence !== undefined && input.confidence < 70) {
    risk += 18;
    reason.push('low-confidence');
  }

  risk = Math.max(0, Math.min(100, Math.round(risk)));

  let band: RiskDecision['band'] = 'low';
  if (risk >= 85) band = 'critical';
  else if (risk >= 65) band = 'high';
  else if (risk >= 35) band = 'medium';

  return {
    allow: risk < 85 && input.trust.permissions.length > 0,
    requireReauth: risk >= 55 || input.trust.requireReauth,
    requireHumanApproval: risk >= 65 || input.action === 'execute' || input.action === 'admin',
    risk,
    band,
    reason,
  };
}
