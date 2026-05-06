const https = require('https');

const targets = [
  process.env.ARTYMUS_API_URL || 'https://reactor-theory.vercel.app/api/artymus',
  process.env.ARTYMUS_HEALTH_URL || 'https://reactor-theory.vercel.app/api/artymus?action=health',
];

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ url, statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error(`Timeout checking ${url}`));
    });
  });
}

(async () => {
  const failures = [];

  for (const target of targets) {
    const result = await get(target);
    const type = String(result.headers['content-type'] || '');

    let parsed;
    try {
      parsed = JSON.parse(result.body);
    } catch (error) {
      failures.push(`${target} did not return valid JSON. status=${result.statusCode} content-type=${type} body-start=${result.body.slice(0, 120)}`);
      continue;
    }

    if (result.statusCode < 200 || result.statusCode >= 300) {
      failures.push(`${target} returned non-2xx status ${result.statusCode}`);
    }

    if (!parsed || parsed.ok !== true || parsed.service !== 'ARTYMUS') {
      failures.push(`${target} returned JSON but failed contract: ${JSON.stringify(parsed)}`);
    }

    if (!type.includes('application/json')) {
      failures.push(`${target} returned JSON body but content-type was not application/json: ${type}`);
    }

    console.log(`[PASS] ${target}`);
  }

  if (failures.length) {
    console.error('\nARTYMUS API JSON verification failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('\nARTYMUS API JSON verification passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
