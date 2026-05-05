export default function handler(req: any, res: any) {
  const url = new URL(req.url || '/api/artymus', 'https://reactor-theory.vercel.app');
  const action = url.searchParams.get('action') || 'root';

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
    timestamp: new Date().toISOString(),
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
        controlRoom: 'https://reactor-theory.vercel.app/ui/artymus-control-room.html',
        commandLayer: 'https://reactor-theory.vercel.app/ui/artymus-command-layer.html',
        shaunaLogin: 'https://reactor-theory.vercel.app/ui/shauna-operator-login.html',
        rt11Dashboard: 'https://reactor-theory.vercel.app/ui/rt11-dashboard.html',
      },
    });
    return;
  }

  res.status(200).json({
    ...base,
    message: 'ARTYMUS API root online. Use ?action=health or ?action=links for checks.',
    endpoints: [
      '/api/artymus',
      '/api/artymus?action=health',
      '/api/artymus?action=links',
    ],
  });
}
