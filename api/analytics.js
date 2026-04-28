const memoryEvents = []

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const event = {
        event: String(body.event || 'unknown_event').slice(0, 120),
        path: String(body.path || '').slice(0, 240),
        session: String(body.session || 'anonymous').slice(0, 120),
        source: 'reactor-theory-site',
        at: new Date().toISOString(),
      }
      memoryEvents.push(event)
      while (memoryEvents.length > 500) memoryEvents.shift()
      res.status(200).json({ ok: true, event })
    } catch (error) {
      res.status(400).json({ ok: false, error: 'invalid_event_payload' })
    }
    return
  }

  if (req.method === 'GET') {
    res.status(200).json({ ok: true, events: memoryEvents.slice(-100).reverse() })
    return
  }

  res.status(405).json({ ok: false, error: 'method_not_allowed' })
}
