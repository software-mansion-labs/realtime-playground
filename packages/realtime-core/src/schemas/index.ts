import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Realtime Client
// ---------------------------------------------------------------------------

export const vsnSchema = z.enum(['1.0.0', '2.0.0'], { error: 'Incorrect VSN' })
export type Vsn = z.infer<typeof vsnSchema>

const positiveIntSchema = z.number().int().positive({ error: 'Must be positive' })

export const realtimeClientSchema = z.object({
  worker: z.boolean().default(true).nonoptional(),
  vsn: vsnSchema.default('2.0.0').nonoptional(),
  timeout: positiveIntSchema.optional(),
  heartbeatIntervalMs: positiveIntSchema.optional(),
})

export type RealtimeClientFormValues = z.infer<typeof realtimeClientSchema>

// ---------------------------------------------------------------------------
// Login form schema
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').nonoptional(),
  password: z.string().min(1, 'Password is required').nonoptional(),
})

export type LoginValues = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------------
// Channel creation form schema
// ---------------------------------------------------------------------------

export const channelConfigSchema = z.object({
  private: z.boolean().nonoptional(),
  broadcast: z.object({
    ack: z.boolean().nonoptional(),
    self: z.boolean().nonoptional(),
    replay: z
      .object({
        since: z
          .date({ error: 'Required' })
          .refine((d) => d <= new Date(), { error: 'Cannot be in the future' })
          .transform((d) => d.getTime())
          .nonoptional(),
        // max limit: https://supabase.com/docs/guides/realtime/broadcast?queryGroups=language&language=js#broadcast-replay
        limit: positiveIntSchema.max(25, { error: 'Max 25' }).optional(),
      })
      .optional(),
  }),
  presence: z.object({
    enabled: z.boolean().nonoptional(),
    key: z.string().optional(),
  }),
})

export const channelFormSchema = z.object({
  name: z.string().min(1, 'Channel name is required').nonoptional(),
  config: channelConfigSchema.nonoptional(),
})

export type ChannelFormValues = z.infer<typeof channelFormSchema>
export type ChannelFormInput = z.input<typeof channelFormSchema>

// ---------------------------------------------------------------------------
// Postgres listener schema
// ---------------------------------------------------------------------------

export const postgresListenerSchema = z.object({
  schema: z.string().min(1, 'Schema is required').default('public').nonoptional(),
  table: z.string().optional(),
  event: z
    .enum(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT)
    .default(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL)
    .nonoptional(),
})

export type PostgresListenerValues = z.infer<typeof postgresListenerSchema>

// ---------------------------------------------------------------------------
// Broadcast
// ---------------------------------------------------------------------------

export const broadcastSendSchema = z.object({
  event: z.string().min(1, 'Event name is required').default('message').nonoptional(),
  message: z.string().optional(),
})

export type BroadcastSendValues = z.infer<typeof broadcastSendSchema>

// ---------------------------------------------------------------------------
// Defaults creators
// ---------------------------------------------------------------------------

export const createRealtimeClientDefaults = (): RealtimeClientFormValues => ({
  worker: true,
  vsn: '2.0.0',
  timeout: undefined,
  heartbeatIntervalMs: undefined,
})

export const createChannelDefaults = (name = 'test'): ChannelFormInput => ({
  name,
  config: {
    private: false,
    broadcast: { ack: true, self: true },
    presence: { enabled: true },
  },
})

export const createPostgresListenerDefaults = (): PostgresListenerValues => ({
  schema: 'public',
  event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
})
