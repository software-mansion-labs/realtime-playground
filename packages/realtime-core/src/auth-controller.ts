import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { FeedbackLevel, RealtimeController } from './controller'
import { createExternalStore, useExternalStoreSnapshot } from './store'

export type SupabaseAuthState = {
  client?: SupabaseClient
  userId?: string
  email?: string
  token?: string
}

export type SupabaseAuthConfig = {
  supabaseUrl: string
  supabaseKey: string
  realtimeController?: RealtimeController
}

export type SupabaseAuthFeedbackEvent = {
  level: FeedbackLevel
  message: string
  data?: unknown
}

const initialState = (): SupabaseAuthState => ({
  client: undefined,
  userId: undefined,
  email: undefined,
  token: undefined,
})

export class SupabaseAuthController {
  private readonly store = createExternalStore<SupabaseAuthState>(initialState())
  private readonly listeners = new Set<(event: SupabaseAuthFeedbackEvent) => void>()

  constructor(private readonly config: SupabaseAuthConfig) {}

  getState = () => this.store.getState()

  subscribe = (listener: () => void) => this.store.subscribe(listener)

  onFeedback(listener: (event: SupabaseAuthFeedbackEvent) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(event: SupabaseAuthFeedbackEvent) {
    this.listeners.forEach((listener) => listener(event))
  }

  private setState(next: SupabaseAuthState | ((prev: SupabaseAuthState) => SupabaseAuthState)) {
    this.store.setState(next)
  }

  init() {
    this.setState((prev) => ({
      ...prev,
      client: createClient(this.config.supabaseUrl, this.config.supabaseKey),
    }))
  }

  async login(email: string, password: string) {
    const { client } = this.getState()

    if (!client) {
      this.emit({ level: 'warning', message: 'Supabase auth is not initialized.' })
      return
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      this.emit({ level: 'error', message: `Login failed: ${error.message}`, data: error })
      return
    }

    if (data.session) {
      const token = data.session.access_token
      this.setState((prev) => ({
        ...prev,
        token,
      }))
      this.config.realtimeController?.setAuth(token)

      if (!this.config.realtimeController?.getState().client) {
        this.emit({
          level: 'warning',
          message: 'Realtime client is not created. Update API KEY before creating client',
        })
      }
    }

    this.setState((prev) => ({
      ...prev,
      userId: data.user.id,
      email,
    }))
  }

  async logout() {
    const { client } = this.getState()

    if (!client) {
      return
    }

    await client.auth.signOut()
    this.setState((prev) => ({
      ...prev,
      userId: undefined,
      email: undefined,
      token: undefined,
    }))
    this.config.realtimeController?.setAuth(this.config.supabaseKey)
  }
}

export const createSupabaseAuthController = (config: SupabaseAuthConfig) =>
  new SupabaseAuthController(config)

export const useSupabaseAuthState = (controller: SupabaseAuthController) =>
  useExternalStoreSnapshot({
    getState: controller.getState,
    subscribe: controller.subscribe,
    setState: () => {},
  })
