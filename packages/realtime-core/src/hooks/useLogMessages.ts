'use client'

import type { RealtimeClientOptions } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

export type LogEntry = {
  timestamp: string
  kind: string
  message: string
  data: Record<string, unknown> | undefined
}

export type RealtimeLogger = RealtimeClientOptions['logger']

export function useLogMessages() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((kind: string, message: string, data: unknown) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        kind,
        message: typeof message === 'string' ? message : String(message),
        data:
          data !== null && typeof data === 'object' ? (data as Record<string, unknown>) : undefined,
      },
    ])
  }, [])

  const clear = useCallback(() => setLogs([]), [])

  return { logs, addLog, clear }
}
