import { requireRole } from './_auth';
import { writeAudit } from './_audit';

type GlobalNode = {
  nodeId: string;
  region?: string;
  endpoint?: string;
  role?: string;
  trust?: number;
  risk?: number;
  status?: 'online' | 'degraded' | 'offline';
};

const network = (globalThis as any).__ARTYMUS_GLOBAL_NETWORK__ || new Map<string, any>();
(globalThis as any).__ARTYMUS_GLOBAL_NETWORK__ = network;

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, nodes: Array.from(network.values()) });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const body: GlobalNode = req.body || {};
  const nodeId = body.nodeId || `global_${Date.now()}`;
  const node = {
    nodeId,
    region: body.region || 'unknown',
    endpoint: body.endpoint || null,
    role: body.role || 'governance-node',
    trust: body.trust ?? 75,
    risk: body.risk ?? 25,
    status: body.status || 'online',
    updated_at: new Date().toISOString(),
    registered_by: session.sub,
  };

  network.set(nodeId, node);
  writeAudit(req, { event: 'GLOBAL_NODE_REGISTERED', actor: session.sub, role: session.role, result: 'info', metadata: node });
  return res.status(200).json({ ok: true, node });
}
