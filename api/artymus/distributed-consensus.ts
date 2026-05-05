import { requireRole } from './_auth';

const registry = (globalThis as any).__ARTYMUS_DISTRIBUTED_NODES__ || new Map<string, any>();

export default async function handler(req: any, res: any) {
  const session = await requireRole(req, res, 'advisor');
  if (!session) return;

  const nodes = Array.from(registry.values());

  let allow = 0;
  let deny = 0;
  let abstain = 0;

  for (const n of nodes) {
    if (n.vote === 'allow') allow++;
    else if (n.vote === 'deny') deny++;
    else abstain++;
  }

  const total = nodes.length || 1;
  const consensus = allow / total;

  let decision = 'undetermined';
  if (consensus > 0.66) decision = 'allow';
  else if (deny / total > 0.5) decision = 'deny';

  return res.status(200).json({
    ok: true,
    nodes: nodes.length,
    allow,
    deny,
    abstain,
    consensus,
    decision,
  });
}
