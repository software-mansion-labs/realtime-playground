import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { create } from 'zustand'

import { toast } from '../toaster'
import { useRealtimeStore } from './realtimeStore'

interface SupabaseStore {
  client?: SupabaseClient
  userId?: string
  email?: string
  token?: string
  publicUrl?: string
  publicKey?: string

  init: (publicUrl: string, publicKey: string) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useSupabaseStore = create<SupabaseStore>((set, get) => ({
  init: (publicUrl, publicKey) => {
    const client = createClient(publicUrl, publicKey)
    set({ client, publicUrl, publicKey })
  },

  login: async (email, password) => {
    const { client } = get()

    if (!client) {
      toast.error('Supabase client not initialized')
      return
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(`Login failed: ${error.message}`)
      return
    }

    if (data.session) {
      const state = useRealtimeStore.getState()
      const token = data.session.access_token

      set({ token })
      state.setAuth(token)

      if (!state.client) {
        toast.error('Realtime client not initialized')
        return
      }
    }

    set({ userId: data.user.id, email })
  },

  logout: async () => {
    const { client } = get()

    if (!client) {
      toast.error('Supabase client not initialized')
      return
    }

    await client.auth.signOut()
    set({ userId: undefined, email: undefined, token: undefined })
    useRealtimeStore.getState().setAuth(get().publicKey || '')
    useRealtimeStore.getState().syncChannels()
  },
}))
