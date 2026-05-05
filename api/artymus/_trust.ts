export type TrustInput = {
  role?: string;
  level?: number;
  deniedEvents?: number;
  operatorEvents?: number;
  anomalyRisk?: number;
  sessionBound?: boolean;
  recentSuccesses?: number;
};

export type TrustScore = {
  score: number;
  band: 'low' | 'medium' | 'high' | 'trusted';
  permissions: string[];
  requireReauth: boolean;
  reason: string[];
};

export function calculateTrust(input: TrustInput): TrustScore {
  const reasons: string[] = [];
  let score = 50;

  if (input.sessionBound) {
    score += 15;
    reasons.push('session-bound');
  } else {
    score -= 20;
    reasons.push('unbound-session');
  }

  if ((input.level || 0) >= 2) score += 8;
  if ((input.level || 0) >= 3) score += 7;

  const denied = input.deniedEvents || 0;
  const operator = input.operatorEvents || 0;
  const anomaly = input.anomalyRisk || 0;
  const success = input.recentSuccesses || 0;

  if (success > 0) {
    score += Math.min(success * 2, 10);
    reasons.push('positive-history');
  }

  if (denied > 0) {
    score -= Math.min(denied * 12, 36);
    reasons.push('denied-events');
  }

  if (operator > 2) {
    score -= 10;
    reasons.push('operator-frequency');
  }

  if (anomaly > 0) {
    score -= Math.min(anomaly, 45);
    reasons.push('anomaly-risk');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let band: TrustScore['band'] = 'low';
  if (score >= 85) band = 'trusted';
  else if (score >= 70) band = 'high';
  else if (score >= 45) band = 'medium';

  const permissions: string[] = [];
  if (score >= 35) permissions.push('plates');
  if (score >= 55 && (input.level || 0) >= 2) permissions.push('intelligence-read');
  if (score >= 75 && (input.level || 0) >= 3) permissions.push('execution-links');
  if (score >= 85 && (input.level || 0) >= 3) permissions.push('rt11-console');

  return {
    score,
    band,
    permissions,
    requireReauth: score < 70 || ((input.level || 0) >= 3 && score < 85),
    reason: reasons,
  };
}
