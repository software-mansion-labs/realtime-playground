import { toast } from 'sonner'
import {
  createRealtimeController,
  createSupabaseAuthController,
} from '@realtime-playground/realtime-core'
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '@/lib/constants'

export const realtimeController = createRealtimeController()
export const authController = createSupabaseAuthController({
  supabaseUrl: PUBLIC_SUPABASE_URL,
  supabaseKey: PUBLIC_SUPABASE_KEY,
  realtimeController,
})

realtimeController.onFeedback(({ level, message }) => {
  if (level === 'success') toast.success(message)
  if (level === 'warning') toast.warning(message)
  if (level === 'info') toast.info(message)
  if (level === 'error') toast.error(message)
})

authController.onFeedback(({ level, message }) => {
  if (level === 'success') toast.success(message)
  if (level === 'warning') toast.warning(message)
  if (level === 'info') toast.info(message)
  if (level === 'error') toast.error(message)
})
