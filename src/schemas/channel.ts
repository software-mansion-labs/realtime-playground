import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { z } from 'zod'
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
        since: z.number({ error: 'Required' }).int().nonnegative().nonoptional(),
        limit: z.number().int().positive().max(25).optional(),
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
  config: channelConfigSchema
    .default({
      private: false,
      broadcast: { ack: true, self: true },
      presence: { enabled: true },
    })
    .nonoptional(),
})

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
