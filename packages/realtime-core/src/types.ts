import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type BroadcastMessage = {
  timestamp: string
  channel: string
  event: string
  payload: Record<string, unknown>
}

export type PostgresChange = RealtimePostgresChangesPayload<Record<string, unknown>> & {
  timestamp: string
  channel: string
}

export type PresenceByChannel = Record<string, Record<string, unknown[]>>

export type LogEntry = {
  timestamp: string
  kind: string
  message: string
  data: Record<string, unknown> | undefined
}

export type RealtimeEnvDefaults = {
  realtimeUrl?: string
  supabaseUrl?: string
  supabaseKey?: string
  testUserEmail?: string
}

export type TestSettings = {
  supabaseUrl: string
  supabaseKey: string
}
