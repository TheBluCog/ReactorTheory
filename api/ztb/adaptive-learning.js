const DEFAULT_MODEL = Object.freeze({
  version: 'RT9.1-ADAPTIVE-LEARNING-1.0',
  trust_floor: 1.0,
  learning_mode: 'bounded_observation',
  total_events: 0,
  weights: {},
  last_updated: null
});

let model = structuredClone(DEFAULT_MODEL);

function eventWeight(type) {
  return {
    PASS: 0.05,
    SOFT_FRICTION: 0.35,
    HARD_BLOCK: 0.85
  }[type] || 0.1;
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function resetAdaptiveModel() {
  model = structuredClone(DEFAULT_MODEL);
  return model;
}

export function readAdaptiveModel() {
  return structuredClone(model);
}

export function learnFromEvents(events = []) {
  const recent = events.slice(0, 100);

  for (const event of recent) {
    model.total_events += 1;

    for (const finding of event.metadata || []) {
      const key = finding.class || 'UNCLASSIFIED_DRIFT';
      const current = model.weights[key] || {
        score: 0,
        observations: 0,
        soft: 0,
        hard: 0,
        pass_context: 0
      };

      const increment = eventWeight(event.type);
      current.score = clamp((current.score * 0.82) + increment);
      current.observations += 1;
      if (event.type === 'SOFT_FRICTION') current.soft += 1;
      if (event.type === 'HARD_BLOCK') current.hard += 1;
      if (event.type === 'PASS') current.pass_context += 1;
      model.weights[key] = current;
    }
  }

  model.last_updated = new Date().toISOString();
  return readAdaptiveModel();
}

export function adaptiveRiskForThreat(threat) {
  if (!threat || !model.weights[threat]) return 0;
  const entry = model.weights[threat];
  const hardBoost = entry.hard > 0 ? 0.2 : 0;
  const softBoost = entry.soft >= 2 ? 0.1 : 0;
  return clamp(entry.score + hardBoost + softBoost);
}

export function adaptivePrediction(events = []) {
  learnFromEvents(events);

  const ranked = Object.entries(model.weights)
    .map(([threat, data]) => ({ threat, risk: adaptiveRiskForThreat(threat), ...data }))
    .sort((a, b) => b.risk - a.risk);

  const top = ranked[0];
  if (!top) {
    return {
      status: 'NOMINAL',
      risk: 0,
      message: 'Adaptive model has insufficient drift observations.',
      model: readAdaptiveModel()
    };
  }

  if (top.risk >= 0.72) {
    return {
      status: 'ELEVATED',
      risk: top.risk,
      top_threat: top.threat,
      message: `Adaptive warning: recurring ${top.threat} pattern is approaching control threshold.`,
      model: readAdaptiveModel()
    };
  }

  if (top.risk >= 0.42) {
    return {
      status: 'WATCH',
      risk: top.risk,
      top_threat: top.threat,
      message: `Adaptive watch: ${top.threat} is becoming a repeated drift signature.`,
      model: readAdaptiveModel()
    };
  }

  return {
    status: 'NOMINAL',
    risk: top.risk,
    top_threat: top.threat,
    message: 'Adaptive model remains within nominal bounds.',
    model: readAdaptiveModel()
  };
}
