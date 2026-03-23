import {
  useRealtimeControllerState,
  type RealtimeClientFormValues,
  type RealtimeControllerState,
  type SocketStatus,
} from '@realtime-playground/realtime-core'
import {
  RealtimeChannel,
  RealtimeChannelOptions,
  RealtimeClient,
  RealtimeClientOptions,
} from '@supabase/supabase-js'
import { toast } from 'sonner'
import { realtimeController } from './controllers'

type Logger = (kind: string, msg: string, data: unknown) => void

export type RealtimeStore = RealtimeControllerState & {
  create: (config: RealtimeClientFormValues, logger?: Logger) => void
}

export type SocketStatus = 'closed' | 'connecting' | 'open' | 'closing'

type State = {
  client: RealtimeClient | null
  channels: Map<string, RealtimeChannel>
}

type Action = {
  create: (url: string, options: RealtimeClientOptions) => void
  destroy: () => void
  syncChannels: () => void

  createChannel: (name: string, options?: RealtimeChannelOptions) => void
  removeChannel: (name: string) => void
  subscribe: (name: string) => void
  unsubscribe: (name: string) => void
  trackPresence: (name: string, payload: Record<string, unknown>) => void
  untrackPresence: (name: string) => void
  setAuth: (token: string) => void
}

const actions: Action = {
  create: (url, options) => realtimeController.create(url, options),
  destroy: () => realtimeController.destroy(),
  syncChannels: () => realtimeController.syncChannels(),
  createChannel: (name: string, options?: RealtimeChannelOptions) => {
    realtimeController.createChannel(name, options)
  },
  removeChannel: (name: string) => {
    realtimeController.removeChannel(name)
  },
  subscribe: (name: string) => {
    realtimeController.subscribeToChannel(name)
  },
  unsubscribe: (name: string) => {
    realtimeController.unsubscribe(name)
  },
  trackPresence: (name: string, payload: Record<string, unknown>) => {
    void realtimeController.trackPresence(name, payload)
  },
  untrackPresence: (name: string) => {
    void realtimeController.untrackPresence(name)
  },
  setAuth: (token: string) => {
    void realtimeController.setAuth(token)
  },
}

const getSnapshot = (): RealtimeStore => ({
  ...realtimeController.getState(),
  ...actions,
})

type Selector<T> = (state: RealtimeStore) => T
type UseRealtimeStore = {
  <T>(selector: Selector<T>): T
  getState: () => RealtimeStore
}

export const useRealtimeStore = ((selector) => {
  const state = useRealtimeControllerState(realtimeController)
  return selector({
    ...state,
    ...actions,
  })
}) as UseRealtimeStore

useRealtimeStore.getState = getSnapshot

export type { SocketStatus }
