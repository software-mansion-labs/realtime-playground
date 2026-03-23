import {
  createLoginDefaults,
  createRealtimeClientDefaults,
  loginSchema,
  realtimeClientSchema,
  vsnSchema,
  type LoginValues,
  type RealtimeClientFormValues,
  type Vsn,
} from '@realtime-playground/realtime-core'
import {
  PUBLIC_REALTIME_URL,
  PUBLIC_SUPABASE_KEY,
  PUBLIC_TEST_USER_EMAIL,
} from '../lib/constants'

export {
  loginSchema,
  realtimeClientSchema,
  vsnSchema,
  type LoginValues,
  type RealtimeClientFormValues,
  type Vsn,
}

export const createRealtimeClientFormDefaults = () =>
  createRealtimeClientDefaults({
    realtimeUrl: PUBLIC_REALTIME_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
  })

export const createLoginFormDefaults = () =>
  createLoginDefaults({
    testUserEmail: PUBLIC_TEST_USER_EMAIL,
  })
