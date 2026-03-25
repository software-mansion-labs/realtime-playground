import type {
  RealtimeChannel,
  RealtimeChannelOptions,
  RealtimeClient,
  RealtimeClientOptions,
  SupabaseClient,
} from '@supabase/supabase-js'

export type SocketStatus = 'closed' | 'connecting' | 'open' | 'closing'

// ---------------------------------------------------------------------------
// Realtime Store
// ---------------------------------------------------------------------------

export type RealtimeState = {
  client: RealtimeClient | null
  channels: Map<string, RealtimeChannel>
}

export type RealtimeAction = {
  create: (url: string, options: RealtimeClientOptions) => void
  destroy: () => void

  syncChannels: () => void

  createChannel: (name: string, options: RealtimeChannelOptions) => void
  removeChannel: (name: string) => void

  subscribe: (name: string) => void
  unsubscribe: (name: string) => void

  trackPresence: (name: string, payload: Record<string, unknown>) => void
  untrackPresence: (name: string) => void

  setAuth: (token: string) => void
}

export type RealtimeStore = RealtimeState & RealtimeAction

// ---------------------------------------------------------------------------
// Supabase Store
// ---------------------------------------------------------------------------

export type SupabaseState = {
  client?: SupabaseClient
  userId?: string
  email?: string
  publicUrl?: string
  publicKey?: string
}

export type SupabaseAction = {
  init: (publicUrl: string, publicKey: string) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export type SupabaseStore = SupabaseState & SupabaseAction
