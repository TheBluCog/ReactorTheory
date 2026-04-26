export function predictDrift(events = []) {
  const recent = events.slice(0, 12);
  const soft = recent.filter(e => e.type === 'SOFT_FRICTION').length;
  const hard = recent.filter(e => e.type === 'HARD_BLOCK').length;
  const pass = recent.filter(e => e.type === 'PASS').length;

  const threatCounts = {};
  for (const event of recent) {
    for (const finding of event.metadata || []) {
      const key = finding.class || 'UNCLASSIFIED_DRIFT';
      threatCounts[key] = (threatCounts[key] || 0) + 1;
    }
  }

  const topThreat = Object.entries(threatCounts).sort((a, b) => b[1] - a[1])[0];
  const driftRatio = recent.length ? (soft + hard * 2) / recent.length : 0;

  let prediction = {
    status: 'NOMINAL',
    risk: 0,
    message: 'No predictive drift pattern detected.',
    top_threat: topThreat?.[0] || null,
    window_size: recent.length
  };

  if (hard >= 1 || driftRatio >= 0.45) {
    prediction = {
      status: 'ELEVATED',
      risk: Math.min(1, driftRatio),
      message: `Predictive warning: elevated drift probability. Dominant signal: ${topThreat?.[0] || 'UNKNOWN'}.`,
      top_threat: topThreat?.[0] || null,
      window_size: recent.length
    };
  } else if (soft >= 2 || driftRatio >= 0.25) {
    prediction = {
      status: 'WATCH',
      risk: Math.min(1, driftRatio),
      message: `Predictive watch: repeated soft friction signatures emerging. Dominant signal: ${topThreat?.[0] || 'UNKNOWN'}.`,
      top_threat: topThreat?.[0] || null,
      window_size: recent.length
    };
  }

  return prediction;
}
