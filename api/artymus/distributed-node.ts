import { requireRole } from './_auth';
import { calculateTrust } from './_trust';
import { evaluateRisk } from './_risk';
import { writeAudit } from './_audit';

type NodeInput = {
  nodeId?: string;
  role?: string;
  signal?: string;
  trust?: number;
  risk?: number;
  vote?: 'allow' | 'deny' | 'abstain';
};

const registry = (globalThis as any).__ARTYMUS_DISTRIBUTED_NODES__ || new Map<string, any>();
(globalThis as any).__ARTYMUS_DISTRIBUTED_NODES__ = registry;

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, nodes: Array.from(registry.values()) });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const body: NodeInput = req.body || {};
  const nodeId = body.nodeId || `node_${Date.now()}`;

  const trust = body.trust ?? calculateTrust({ role: session.role, level: session.level, sessionBound: true, recentSuccesses: 3 }).score;
  const risk = body.risk ?? evaluateRisk({ action: 'score', trust: calculateTrust({ role: session.role, level: session.level, sessionBound: true, recentSuccesses: 3 }), role: session.role, level: session.level }).risk;

  const node = {
    nodeId,
    updated_at: new Date().toISOString(),
    submitted_by: session.sub,
    role: body.role || session.role,
    signal: body.signal || 'governance-heartbeat',
    trust,
    risk,
    vote: body.vote || (risk < 65 ? 'allow' : 'abstain'),
  };

  registry.set(nodeId, node);
  writeAudit(req, { event: 'DISTRIBUTED_NODE_UPDATED', actor: session.sub, role: session.role, result: 'info', metadata: node });

  return res.status(200).json({ ok: true, node });
}
