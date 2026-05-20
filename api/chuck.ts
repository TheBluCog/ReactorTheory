function writeJson(res: any, status: number, payload: Record<string, unknown>) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(status).json(payload);
}

function basePayload(req: any) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'reactor-theory.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  return {
    ok: true,
    service: 'AGENT-CHUCK',
    version: '1.0.0',
    stack: 'RT11 / ARTYMUS / Ethic Vault ReactorCore',
    mode: 'advisory/evidence-control',
    status: 'LIVE',
    route: '/api/chuck.ts',
    baseUrl,
    runtime: {
      node: process.version,
      vercelEnv: process.env.VERCEL_ENV || 'local',
      deployment: process.env.VERCEL_URL || host,
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
    timestamp: new Date().toISOString(),
  };
}

const governance = {
  posture: 'operational-calm',
  authority: 'advisory-documentation-only',
  allowedActions: ['ALLOW', 'HOLD', 'BLOCK'],
  defaultDecision: 'HOLD_WHEN_UNSURE',
  legalBoundary: 'not-legal-advice; counsel-review-required',
  flow: 'state -> proof -> control -> audit -> verification',
  invariants: [
    'No confrontation',
    'No threats',
    'No unauthorized publication',
    'No contact escalation',
    'No legal conclusion without human counsel',
    'Evidence first, counsel second, execution never autonomous',
  ],
};

const legalAnchor = {
  jurisdiction: 'Canada',
  case: 'Ahluwalia v. Ahluwalia, 2026 SCC 16',
  topic: 'new tort of intimate partner violence',
  operationalPremise: 'Intimate partner violence may be a sustained pattern of coercive control rather than isolated incidents.',
  source: 'Supreme Court of Canada / public legal reporting',
};

const uap = {
  formula: 'UAP=(E*I*C)/D',
  dimensions: {
    E: 'evidentiary energy: documents, timelines, records, messages, orders, affidavits',
    I: 'intent alignment: safety, lawful process, child welfare, procedural fairness',
    C: 'control/coherence: organized records, lawyer-led strategy, calm communications',
    D: 'drift: emotional escalation, unsupported claims, contact violations, narrative chaos',
  },
  controlPriority: ['reduce_drift', 'restore_coherence', 'align_intent', 'increase_evidence_last'],
};

const patternCategories = [
  'physical_or_sexual_violence',
  'emotional_or_psychological_abuse',
  'financial_control',
  'stalking_or_surveillance',
  'isolation',
  'employment_or_education_interference',
  'litigation_abuse',
  'threats_or_intimidation',
  'child_related_threats_or_control',
  'post_separation_control',
];

const blockedActions = [
  'intimidation',
  'harassment',
  'doxxing',
  'threats',
  'illegal surveillance',
  'unauthorized access',
  'evading court orders',
  'manipulating witnesses',
  'fabricating or embellishing evidence',
  'publishing allegations as pressure tactics',
  'contacting represented parties where inappropriate',
  'replacing professional legal advice',
];

function classifyText(text: string) {
  const lower = text.toLowerCase();
  const hits: Record<string, string[]> = {};

  const lexicon: Record<string, string[]> = {
    emotional_or_psychological_abuse: ['stonewall', 'gaslight', 'humiliate', 'fear', 'intimidat', 'threat', 'control', 'coerc'],
    financial_control: ['money', 'bank', 'withhold', 'support', 'pay', 'debt', 'cost', 'financial'],
    stalking_or_surveillance: ['track', 'gps', 'surveil', 'follow', 'monitor', 'spy', 'location'],
    isolation: ['isolate', 'friends', 'family', 'cut off', 'alone'],
    litigation_abuse: ['affidavit', 'motion', 'court', 'filing', 'lawyer', 'costs', 'conference', 'delay', 'procedural'],
    threats_or_intimidation: ['threat', 'destroy', 'ruin', 'afraid', 'scared', 'message', 'warning'],
    child_related_threats_or_control: ['children', 'child', 'custody', 'access', 'parenting', 'alienat', 'school'],
    post_separation_control: ['separation', 'after we separated', 'post-separation', 'ex spouse', 'former partner'],
  };

  for (const [category, terms] of Object.entries(lexicon)) {
    const matched = terms.filter((term) => lower.includes(term));
    if (matched.length) hits[category] = matched;
  }

  const riskFlags = Object.keys(hits);
  const posture = lower.match(/publish|blast|expose|threaten|contact her|contact him|show up|revenge/) ? 'BLOCK'
    : riskFlags.includes('threats_or_intimidation') || riskFlags.includes('child_related_threats_or_control') ? 'HOLD'
    : 'ALLOW';

  return {
    posture,
    riskLevel: riskFlags.length >= 4 ? 'HIGH' : riskFlags.length >= 2 ? 'MEDIUM' : 'LOW',
    patternFindings: hits,
    evidenceGaps: [
      'exact dates for each incident',
      'source document or screenshot/export for each claim',
      'custody status of each record',
      'lawyer review before external communication',
    ],
    nextSafeStep: posture === 'BLOCK'
      ? 'Do not escalate. Convert the issue into an evidence packet for counsel review.'
      : 'Create a dated chronology and attach source records before making any legal or public claim.',
  };
}

export default function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const action = typeof req.query?.action === 'string' ? req.query.action : 'root';
  const base = basePayload(req);

  if (action === 'health') {
    writeJson(res, 200, { ...base, health: 'green', governance });
    return;
  }

  if (action === 'links') {
    writeJson(res, 200, {
      ...base,
      links: {
        apiRoot: `${base.baseUrl}/api/chuck`,
        apiHealth: `${base.baseUrl}/api/chuck?action=health`,
        apiGovernance: `${base.baseUrl}/api/chuck?action=governance`,
        apiPatterns: `${base.baseUrl}/api/chuck?action=patterns`,
        apiSchemas: `${base.baseUrl}/api/chuck?action=schemas`,
        apiClassify: `${base.baseUrl}/api/chuck?action=classify&text=your%20facts%20here`,
        spec: `${base.baseUrl}/AGENT_CHUCK.md`,
      },
    });
    return;
  }

  if (action === 'governance') {
    writeJson(res, 200, { ...base, governance, legalAnchor, uap, blockedActions });
    return;
  }

  if (action === 'patterns') {
    writeJson(res, 200, {
      ...base,
      patternCategories,
      litigationAbuseIndicators: [
        'repeated urgent filings with weak evidentiary support',
        'procedural delay used as pressure',
        'cost exhaustion tactics',
        'affidavit narrative inflation',
        'child-related allegations used without proportional evidence',
        'settlement positions that require surrender of lawful rights',
        'reframing alleged abuse as mere high conflict without analysis',
      ],
    });
    return;
  }

  if (action === 'schemas') {
    writeJson(res, 200, {
      ...base,
      evidencePacketSchema: {
        packet_id: 'CHUCK-EVIDENCE-YYYYMMDD-0001',
        created_at: 'ISO-8601',
        source_type: 'text_message | email | affidavit | order | police_record | call_log | witness_note | financial_record | other',
        source_date: 'YYYY-MM-DD',
        custody_status: 'original | screenshot | export | transcript | summary',
        summary: 'plain-language factual summary',
        pattern_tags: [],
        risk_flags: [],
        recommended_posture: 'ALLOW | HOLD | BLOCK',
        counsel_note: 'what a lawyer should check next',
      },
      outputSchema: {
        AGENT_CHUCK: {
          mode: 'COUNSEL_BRIEF | TIMELINE | PATTERN | DRIFT_AUDIT | SAFETY_GATE',
          posture: 'ALLOW | HOLD | BLOCK',
          risk_level: 'LOW | MEDIUM | HIGH',
          summary: '',
          evidence_gaps: [],
          pattern_findings: [],
          lawyer_questions: [],
          blocked_actions: [],
          next_safe_step: '',
        },
      },
    });
    return;
  }

  if (action === 'classify') {
    const text = typeof req.query?.text === 'string' ? req.query.text : '';
    const result = classifyText(text);
    writeJson(res, 200, {
      ...base,
      inputLength: text.length,
      AGENT_CHUCK: {
        mode: 'PATTERN_CLASSIFIER',
        posture: result.posture,
        risk_level: result.riskLevel,
        summary: text ? 'Deterministic keyword pattern pass completed. This is an advisory screen, not a legal finding.' : 'No text supplied. Add ?text=your%20facts%20here.',
        evidence_gaps: result.evidenceGaps,
        pattern_findings: result.patternFindings,
        lawyer_questions: [
          'Which records prove each dated event?',
          'Which facts show a pattern rather than isolated conflict?',
          'Which communications should stop and route through counsel?',
          'What immediate safety or court-order constraints apply?',
        ],
        blocked_actions: blockedActions,
        next_safe_step: result.nextSafeStep,
      },
    });
    return;
  }

  writeJson(res, 200, {
    ...base,
    message: 'Agent Chuck API root online.',
    tagline: 'Operational calm wins. Evidence moves. Noise dies.',
    endpoints: [
      '/api/chuck',
      '/api/chuck?action=health',
      '/api/chuck?action=links',
      '/api/chuck?action=governance',
      '/api/chuck?action=patterns',
      '/api/chuck?action=schemas',
      '/api/chuck?action=classify&text=your%20facts%20here',
    ],
    governance,
    legalAnchor,
    uap,
  });
}
