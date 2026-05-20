const http = require('http');
const https = require('https');

const baseUrl = (process.env.CHUCK_BASE_URL || 'https://reactor-theory.vercel.app').replace(/\/$/, '');

const targets = [
  { name: 'Chuck root', url: `${baseUrl}/api/chuck`, required: ['ok', 'service', 'version', 'status'] },
  { name: 'Chuck health', url: `${baseUrl}/api/chuck?action=health`, required: ['ok', 'service', 'health', 'governance'] },
  { name: 'Chuck links', url: `${baseUrl}/api/chuck?action=links`, required: ['ok', 'service', 'links'] },
  { name: 'Chuck governance', url: `${baseUrl}/api/chuck?action=governance`, required: ['ok', 'service', 'governance', 'uap'] },
  { name: 'Chuck patterns', url: `${baseUrl}/api/chuck?action=patterns`, required: ['ok', 'service', 'patternCategories'] },
  { name: 'Chuck schemas', url: `${baseUrl}/api/chuck?action=schemas`, required: ['ok', 'service', 'evidencePacketSchema'] },
  { name: 'Chuck classify', url: `${baseUrl}/api/chuck?action=classify&text=Repeated%20court%20motions%20and%20custody%20threats`, required: ['ok', 'service', 'AGENT_CHUCK'] },
];

function request(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const startedAt = Date.now();
    const req = client.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ url, statusCode: res.statusCode, headers: res.headers, body, latencyMs: Date.now() - startedAt }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error(`Timeout checking ${url}`)));
  });
}

function validate(target, result) {
  const failures = [];
  const type = String(result.headers['content-type'] || '');
  let parsed;

  try {
    parsed = JSON.parse(result.body);
  } catch (error) {
    failures.push(`${target.name}: invalid JSON. status=${result.statusCode} content-type=${type}`);
    return { failures, parsed: null };
  }

  if (result.statusCode < 200 || result.statusCode >= 300) failures.push(`${target.name}: non-2xx status ${result.statusCode}`);
  if (!type.includes('application/json')) failures.push(`${target.name}: content-type not application/json: ${type}`);
  if (parsed.ok !== true) failures.push(`${target.name}: expected ok=true`);
  if (parsed.service !== 'AGENT-CHUCK') failures.push(`${target.name}: expected service=AGENT-CHUCK`);

  for (const key of target.required) {
    if (!(key in parsed)) failures.push(`${target.name}: missing '${key}'`);
  }

  if (result.body.trim().startsWith('<')) failures.push(`${target.name}: received HTML shell instead of JSON`);

  return { failures, parsed };
}

(async () => {
  const failures = [];
  const report = [];

  for (const target of targets) {
    const result = await request(target.url);
    const validation = validate(target, result);
    failures.push(...validation.failures);
    report.push({ name: target.name, url: target.url, statusCode: result.statusCode, contentType: result.headers['content-type'] || null, latencyMs: result.latencyMs, ok: validation.failures.length === 0 });
    console.log(`${validation.failures.length === 0 ? '[PASS]' : '[FAIL]'} ${target.name} ${target.url}`);
  }

  console.log('\nAgent Chuck smoke report:');
  console.log(JSON.stringify(report, null, 2));

  if (failures.length) {
    console.error('\nAgent Chuck smoke verification failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('\nAgent Chuck smoke verification passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
