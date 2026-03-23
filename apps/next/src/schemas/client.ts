import { z } from 'zod'
import { positiveIntSchema } from './common'

export const vsnSchema = z.enum(['1.0.0', '2.0.0'], { error: 'Incorrect VSN' })

export const realtimeClientSchema = z.object({
  url: z.string().min(1, 'URL is required').default(PUBLIC_REALTIME_URL).nonoptional(),
  apiKey: z.string().min(1, 'API key is required').default(PUBLIC_SUPABASE_KEY).nonoptional(),
  worker: z.boolean().default(true).nonoptional(),
  vsn: vsnSchema.default('2.0.0').nonoptional(),
  timeout: positiveIntStr.optional(),
  heartbeatIntervalMs: positiveIntStr.optional(),
})

export type RealtimeClientFormValues = z.infer<typeof realtimeClientSchema>

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').default(PUBLIC_TEST_USER_EMAIL).nonoptional(),
  password: z.string().min(1, 'Password is required').nonoptional(),
})

export type LoginValues = z.infer<typeof loginSchema>
