'use client'

import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

export type BroadcastMessage = {
  timestamp: string
  channel: string
  event: string
  payload: Record<string, unknown>
}

export function useBroadcastMessages() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([])

  const addListener = useCallback(
    (channel: RealtimeChannel, channelName: string, event?: string) => {
      channel.on('broadcast', { event: event ?? '*' }, ({ event: nextEvent, payload }) => {
        setMessages((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            channel: channelName,
            event: nextEvent,
            payload,
          },
        ])
      })
    },
    [],
  )

  const clear = useCallback(() => setMessages([]), [])

  return { messages, addListener, clear }
}
