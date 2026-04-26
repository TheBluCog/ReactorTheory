export const PERSONAS = Object.freeze({
  joshua: {
    id: 'joshua',
    label: 'JOSHUA',
    mode: 'cinematic',
    role: 'Strategic AI analyst',
    humHz: 58,
    voice: { rate: 0.84, pitch: 0.66, volume: 0.94 },
    description: 'Calm, cinematic, analytical control-room intelligence.'
  },
  chuck: {
    id: 'chuck',
    label: 'CHUCK',
    mode: 'cinematic',
    role: 'Boundary enforcer',
    humHz: 52,
    voice: { rate: 0.9, pitch: 0.58, volume: 0.96 },
    description: 'Direct, aggressive, decisive enforcement posture.'
  },
  oracle: {
    id: 'oracle',
    label: 'ORACLE',
    mode: 'cinematic',
    role: 'Predictive drift interpreter',
    humHz: 64,
    voice: { rate: 0.78, pitch: 0.74, volume: 0.9 },
    description: 'Reflective, predictive, pattern-oriented system narration.'
  },
  auditor: {
    id: 'auditor',
    label: 'AUDITOR',
    mode: 'executive',
    role: 'Compliance and evidence officer',
    humHz: 60,
    voice: { rate: 0.96, pitch: 0.86, volume: 0.56 },
    description: 'Neutral, precise, enterprise-safe compliance voice.'
  },
  corporate: {
    id: 'corporate',
    label: 'CORPORATE',
    mode: 'executive',
    role: 'Executive governance narrator',
    humHz: 60,
    voice: { rate: 0.96, pitch: 0.86, volume: 0.56 },
    description: 'Boardroom-safe language for executive demonstrations.'
  },
  neutral: {
    id: 'neutral',
    label: 'NEUTRAL',
    mode: 'executive',
    role: 'Default telemetry announcer',
    humHz: 60,
    voice: { rate: 0.92, pitch: 0.82, volume: 0.7 },
    description: 'Minimal, plain event narration.'
  }
});

export function getPersona(id = 'joshua') {
  return PERSONAS[id] || PERSONAS.joshua;
}
