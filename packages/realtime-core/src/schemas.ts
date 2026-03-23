import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { z } from 'zod'
import type { RealtimeEnvDefaults, TestSettings } from './types'

export const vsnSchema = z.enum(['1.0.0', '2.0.0'])
export type Vsn = z.infer<typeof vsnSchema>

const positiveIntStr = z
  .string()
  .optional()
  .refine((v) => v === undefined || v === '' || (Number.isFinite(Number(v)) && Number(v) > 0), {
    message: 'Must be a positive number',
  })

export const realtimeClientSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  apiKey: z.string().min(1, 'API key is required'),
  worker: z.boolean().default(true).nonoptional(),
  vsn: vsnSchema.default('2.0.0').nonoptional(),
  timeout: positiveIntStr.optional(),
  heartbeatIntervalMs: positiveIntStr.optional(),
})

export type RealtimeClientFormValues = z.infer<typeof realtimeClientSchema>

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const channelConfigSchema = z.object({
  private: z.boolean().nonoptional(),
  broadcast: z.object({
    ack: z.boolean().nonoptional(),
    self: z.boolean().nonoptional(),
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
export type ChannelConfigValues = z.infer<typeof channelConfigSchema>

export const broadcastSendSchema = z.object({
  event: z.string().min(1, 'Event is required'),
  message: z.string().optional(),
})

export type BroadcastSendValues = z.infer<typeof broadcastSendSchema>

export const postgresListenerSchema = z.object({
  schema: z.string().min(1, 'Schema is required'),
  table: z.string().optional(),
  event: z
    .enum(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT)
    .default(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL)
    .nonoptional(),
})

export type PostgresListenerValues = z.infer<typeof postgresListenerSchema>

export const createRealtimeClientDefaults = (
  env: RealtimeEnvDefaults = {},
): RealtimeClientFormValues => ({
  url: env.realtimeUrl ?? '',
  apiKey: env.supabaseKey ?? '',
  worker: true,
  vsn: '2.0.0',
  timeout: undefined,
  heartbeatIntervalMs: undefined,
})

export const createLoginDefaults = (env: RealtimeEnvDefaults = {}): LoginValues => ({
  email: env.testUserEmail ?? '',
  password: '',
})

export const createChannelDefaults = (name = 'test'): ChannelFormValues =>
  channelFormSchema.parse({
    name,
    config: {
      private: false,
      broadcast: { ack: true, self: true },
      presence: { enabled: true },
    },
  })

export const createBroadcastSendDefaults = (): BroadcastSendValues =>
  broadcastSendSchema.parse({
    event: 'message',
    message: '',
  })

export const createPostgresListenerDefaults = (): PostgresListenerValues =>
  postgresListenerSchema.parse({
    schema: 'public',
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
  })

export const createTestSettingsDefaults = (env: RealtimeEnvDefaults = {}): TestSettings => ({
  supabaseUrl: env.supabaseUrl ?? '',
  supabaseKey: env.supabaseKey ?? '',
})
