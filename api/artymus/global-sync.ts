import { requireRole } from './_auth';

const network = (globalThis as any).__ARTYMUS_GLOBAL_NETWORK__ || new Map<string, any>();

type GlobalNode = {
  nodeId?: string;
  trust?: number;
  risk?: number;
  status?: string;
};

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const nodes = Array.from(network.values()) as GlobalNode[];

  const summary = nodes.map((n) => ({
    nodeId: n.nodeId || 'unknown',
    trust: n.trust || 0,
    risk: n.risk || 0,
    status: n.status || 'unknown',
  }));

  const avgTrust = nodes.reduce((s, n) => s + (n.trust || 0), 0) / (nodes.length || 1);
  const avgRisk = nodes.reduce((s, n) => s + (n.risk || 0), 0) / (nodes.length || 1);

  return res.status(200).json({ ok: true, nodes: summary, avgTrust, avgRisk, health: avgTrust > 70 && avgRisk < 50 ? 'stable' : 'degraded' });
}
