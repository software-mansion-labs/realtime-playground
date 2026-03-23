import type {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

export type PostgresChange = RealtimePostgresChangesPayload<Record<string, unknown>> & {
  /** ISO string — time we received the event in the browser */
  timestamp: string
  /** Channel name the event arrived on */
  channel: string
}

export function usePostgresChanges() {
  const [changes, setChanges] = useState<PostgresChange[]>([])

  const addListener = useCallback(
    (
      channel: RealtimeChannel,
      channelName: string,
      event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
      schema: string,
      table?: string,
    ) => {
      channel.on('postgres_changes', { event, schema, table }, (payload) => {
        setChanges((prev) => [
          ...prev,
          {
            ...payload,
            timestamp: new Date().toISOString(),
            channel: channelName,
          },
        ])
      })
    },
    [],
  )

  const clear = useCallback(() => setChanges([]), [])

  return { changes, addListener, clear }
}
