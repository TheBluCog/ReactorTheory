export default function handler(_req: any, res: any) {
  res.status(410).json({
    ok: false,
    error: 'LEGACY_ARTYMUS_ROUTE_DISABLED',
    route: 'api/artymus/live-loop',
    replacement: '/api/rt11 or consolidated ARTYMUS runtime'
  });
}
