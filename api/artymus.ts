export default function handler(req: any, res: any) {
  const action = typeof req.query?.action === 'string' ? req.query.action : 'root';

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const base = {
    ok: true,
    service: 'ARTYMUS',
    version: '3.0.1',
    stack: 'RT11',
    mode: 'demo/testnet-next',
    status: 'LIVE',
    route: '/api/artymus.ts',
    timestamp: new Date().toISOString()
  };

  if (action === 'health') {
    res.status(200).json({ ...base, health: 'green' });
    return;
  }

  if (action === 'links') {
    res.status(200).json({
      ...base,
      links: {
        main: 'https://reactor-theory.vercel.app',
        apiRoot: 'https://reactor-theory.vercel.app/api/artymus',
        apiHealth: 'https://reactor-theory.vercel.app/api/artymus?action=health',
        branchApiHealth: 'https://reactor-theory-git-main-theblucogs-projects.vercel.app/api/artymus?action=health'
      }
    });
    return;
  }

  res.status(200).json({
    ...base,
    message: 'ARTYMUS API root online.',
    endpoints: [
      '/api/artymus',
      '/api/artymus?action=health',
      '/api/artymus?action=links'
    ]
  });
}
