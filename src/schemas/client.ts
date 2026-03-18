import { z } from 'zod'

export const vsnSchema = z.enum(['1.0.0', '2.0.0'], { error: 'Incorrect VSN' })

export const realtimeClientSchema = z.object({
  url: z.string().min(1, 'URL is required').nonoptional(),
  apiKey: z.string().min(1, 'API key is required').nonoptional(),
  worker: z.boolean().nonoptional(),
  vsn: vsnSchema.nonoptional(),
  timeout: z.number().int().positive().optional(),
  heartbeatIntervalMs: z.number().int().positive().optional(),
})

export type RealtimeClientValues = z.infer<typeof realtimeClientSchema>
