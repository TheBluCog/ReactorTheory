const http = require('http');
const https = require('https');

const baseUrl = (process.env.ARTYMUS_BASE_URL || 'https://reactor-theory.vercel.app').replace(/\/$/, '');
const isLocalPreview = /127\.0\.0\.1|localhost/.test(baseUrl);

const targets = [
  {
    name: 'ARTYMUS root',
    url: process.env.ARTYMUS_API_URL || `${baseUrl}/api/artymus`,
    service: 'ARTYMUS',
    required: ['ok', 'service', 'version', 'stack', 'status'],
    localPreview: true,
  },
  {
    name: 'ARTYMUS health',
    url: process.env.ARTYMUS_HEALTH_URL || `${baseUrl}/api/artymus?action=health`,
    service: 'ARTYMUS',
    required: ['ok', 'service'],
    localPreview: true,
  },
  {
    name: 'ARTYMUS links',
    url: process.env.ARTYMUS_LINKS_URL || `${baseUrl}/api/artymus?action=links`,
    service: 'ARTYMUS',
    required: ['ok', 'service'],
    localPreview: true,
  },
  {
    name: 'Debug root',
    url: process.env.ARTYMUS_DEBUG_URL || `${baseUrl}/api/debug`,
    service: 'ARTYMUS-DEBUG',
    required: ['ok', 'service', 'endpoints'],
    localPreview: false,
  },
  {
    name: 'Debug diagnostics',
    url: process.env.ARTYMUS_DEBUG_DIAGNOSTICS_URL || `${baseUrl}/api/debug?action=diagnostics`,
    service: 'ARTYMUS-DEBUG',
    required: ['ok', 'service', 'checks'],
    localPreview: false,
  },
  {
    name: 'Debug repair plan',
    url: process.env.ARTYMUS_DEBUG_REPAIR_URL || `${baseUrl}/api/debug?action=repair-plan`,
    service: 'ARTYMUS-DEBUG',
    required: ['ok', 'service', 'repairPlan'],
    localPreview: false,
  },
];

function request(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const startedAt = Date.now();
    const req = client.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({
        url,
        statusCode: res.statusCode,
        headers: res.headers,
        body,
        latencyMs: Date.now() - startedAt,
      }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error(`Timeout checking ${url}`)));
  });
}

function validateJsonContract(target, result) {
  const failures = [];
  const warnings = [];
  const type = String(result.headers['content-type'] || '');

  let parsed;
  try {
    parsed = JSON.parse(result.body);
  } catch (error) {
    failures.push(`${target.name}: did not return valid JSON. status=${result.statusCode} content-type=${type} body-start=${result.body.slice(0, 160)}`);
    return { failures, warnings, parsed: null };
  }

  if (result.statusCode < 200 || result.statusCode >= 300) {
    failures.push(`${target.name}: returned non-2xx status ${result.statusCode}`);
  }

  if (!type.includes('application/json')) {
    const message = `${target.name}: returned JSON body but content-type was not application/json: ${type}`;
    if (isLocalPreview && target.localPreview) warnings.push(message);
    else failures.push(message);
  }

  if (!parsed || parsed.ok !== true) {
    failures.push(`${target.name}: expected ok=true, got ${JSON.stringify(parsed)}`);
  }

  if (!parsed || parsed.service !== target.service) {
    failures.push(`${target.name}: expected service=${target.service}, got ${parsed && parsed.service}`);
  }

  for (const key of target.required) {
    if (!(key in parsed)) {
      failures.push(`${target.name}: missing required key '${key}'`);
    }
  }

  if (result.body.trim().startsWith('<!doctype') || result.body.trim().startsWith('<html')) {
    failures.push(`${target.name}: received HTML shell instead of JSON`);
  }

  return { failures, warnings, parsed };
}

(async () => {
  const failures = [];
  const warnings = [];
  const report = [];
  const effectiveTargets = isLocalPreview ? targets.filter((target) => target.localPreview) : targets;

  if (isLocalPreview) {
    console.log('Local Vite preview detected. Verifying static ARTYMUS JSON fallback only; serverless debug endpoints are production-only.');
  }

  for (const target of effectiveTargets) {
    const result = await request(target.url);
    const validation = validateJsonContract(target, result);
    failures.push(...validation.failures);
    warnings.push(...validation.warnings);

    report.push({
      name: target.name,
      url: target.url,
      statusCode: result.statusCode,
      contentType: result.headers['content-type'] || null,
      latencyMs: result.latencyMs,
      ok: validation.failures.length === 0,
      warnings: validation.warnings.length,
    });

    if (validation.failures.length === 0) {
      console.log(`[PASS] ${target.name} ${target.url} (${result.latencyMs}ms)`);
    } else {
      console.error(`[FAIL] ${target.name} ${target.url}`);
    }
  }

  console.log('\nARTYMUS smoke report:');
  console.log(JSON.stringify(report, null, 2));

  if (warnings.length) {
    console.warn('\nARTYMUS smoke warnings:');
    for (const warning of warnings) console.warn(`- ${warning}`);
  }

  if (failures.length) {
    console.error('\nARTYMUS smoke / verification failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('\nARTYMUS smoke / verification passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
