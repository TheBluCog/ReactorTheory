import crypto from 'crypto';

const REQUIRED_ENV = [
  'ZTB_SECRET',
  'ZTB_OPERATOR_SECRET',
  'ZTB_ALLOWED_TENANTS'
];

const TENANT_POLICY = new Map();
const RATE_BUCKETS = new Map();

function sha256(data) {
  return crypto.createHash('sha256').update(String(data)).digest('hex');
}

export function validateProductionEnvironment() {
  const missing = REQUIRED_ENV.filter(key => !process.env[key]);
  return {
    ok: missing.length === 0,
    missing,
    mode: missing.length === 0 ? 'PRODUCTION_READY_ENV' : 'DEVELOPMENT_OR_INCOMPLETE_ENV'
  };
}

export function allowedTenants() {
  return new Set((process.env.ZTB_ALLOWED_TENANTS || '').split(',').map(x => x.trim()).filter(Boolean));
}

export function assertTenantAllowed(tenantId) {
  const tenants = allowedTenants();
  if (!tenantId || !tenants.has(tenantId)) {
    return { ok: false, reason: 'TENANT_NOT_ALLOWED' };
  }
  return { ok: true };
}

export function tenantHash(tenantId) {
  return sha256(tenantId).slice(0, 16);
}

export function bindPolicyToTenant({ tenantId, policy }) {
  const key = tenantHash(tenantId);
  const bound = {
    ...policy,
    tenant_hash: key,
    bound_at: new Date().toISOString(),
    policy_tenant_binding_hash: sha256(JSON.stringify(policy) + key)
  };
  TENANT_POLICY.set(key, Object.freeze(bound));
  return bound;
}

export function readTenantPolicy(tenantId) {
  return TENANT_POLICY.get(tenantHash(tenantId)) || null;
}

export function verifyOperatorSignature({ operator, action, ts, sig }) {
  if (!process.env.ZTB_OPERATOR_SECRET) {
    return { ok: false, reason: 'OPERATOR_SECRET_NOT_CONFIGURED' };
  }
  if (!operator || !action || !ts || !sig) {
    return { ok: false, reason: 'MISSING_OPERATOR_SIGNATURE_FIELDS' };
  }
  if (Math.abs(Date.now() - Number(ts)) > 60000) {
    return { ok: false, reason: 'OPERATOR_SIGNATURE_EXPIRED' };
  }
  const expected = crypto
    .createHmac('sha256', process.env.ZTB_OPERATOR_SECRET)
    .update(`${operator}:${action}:${ts}`)
    .digest('hex');

  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  return { ok, reason: ok ? 'OK' : 'INVALID_OPERATOR_SIGNATURE' };
}

export function rateLimit({ tenantId, route, limit = 60, windowMs = 60000 }) {
  const key = `${tenantHash(tenantId)}:${route}`;
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  RATE_BUCKETS.set(key, bucket);

  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt
  };
}

export function productionRequestChecklist({ tenantId, route }) {
  const env = validateProductionEnvironment();
  const tenant = assertTenantAllowed(tenantId);
  const rl = rateLimit({ tenantId, route });

  return {
    ok: env.ok && tenant.ok && rl.ok,
    env,
    tenant,
    rate_limit: rl
  };
}
