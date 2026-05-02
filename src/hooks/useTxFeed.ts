import { useCallback, useEffect, useState } from 'react'

export type TxFeedEvent = {
  id: string
  type: 'api_score_ready' | 'payout_preview_ready' | 'tx_blocked' | 'tx_signing' | 'tx_submitted' | 'tx_confirmed' | 'tx_failed'
  tx?: string
  network: string
  time: string
  detail: string
}

const STORAGE_KEY = 'rt11_tx_feed'

function readFeed(): TxFeedEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useTxFeed() {
  const [feed, setFeed] = useState<TxFeedEvent[]>(readFeed)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(feed.slice(0, 20)))
  }, [feed])

  const addEvent = useCallback((event: Omit<TxFeedEvent, 'id' | 'time'> & { time?: string }) => {
    setFeed(prev => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        time: event.time || new Date().toISOString(),
        ...event,
      },
      ...prev,
    ].slice(0, 20))
  }, [])

  const clearFeed = useCallback(() => setFeed([]), [])

  return { feed, addEvent, clearFeed }
}
