import { readWormEvents } from './audit.js';

export default function handler(req, res) {
  const events = readWormEvents({ limit: 50 });
  res.status(200).json(events);
}
