import type { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

import type { BroadcastMessage, LogEntry, PostgresChange, PresenceByChannel } from './types'

function isoNow() {
  return new Date().toISOString()
}

export function useBroadcastMessages() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([])

  const addListener = useCallback(
    (channel: RealtimeChannel, channelName: string, event?: string) => {
      channel.on('broadcast', { event: event ?? '*' }, ({ event: nextEvent, payload }) => {
        setMessages((prev) => [
          ...prev,
          {
            timestamp: isoNow(),
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
            timestamp: isoNow(),
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

export function usePresenceState() {
  const [presenceState, setPresenceState] = useState<PresenceByChannel>({})

  const addListener = useCallback((channel: RealtimeChannel, channelName: string) => {
    const syncState = () => {
      setPresenceState((prev) => ({
        ...prev,
        [channelName]: channel.presenceState() as Record<string, unknown[]>,
      }))
    }

    channel.on('presence', { event: 'sync' }, syncState)
    channel.on('presence', { event: 'join' }, syncState)
    channel.on('presence', { event: 'leave' }, syncState)
  }, [])

  const clear = useCallback(() => setPresenceState({}), [])

  return { presenceState, addListener, clear }
}

export function useLogMessages() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((kind: string, message: string, data: unknown) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: isoNow(),
        kind,
        message,
        data:
          data !== null && typeof data === 'object' ? (data as Record<string, unknown>) : undefined,
      },
    ])
  }, [])

  const clear = useCallback(() => setLogs([]), [])

  return { logs, addLog, clear }
}
