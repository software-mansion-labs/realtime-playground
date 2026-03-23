import {
  useRealtimeControllerState,
  type RealtimeClientFormValues,
  type RealtimeControllerState,
  type SocketStatus,
} from '@realtime-playground/realtime-core'
import type { ChannelConfigValues } from '@/schemas/channel'
import { realtimeController } from './controllers'

type Logger = (kind: string, msg: string, data: unknown) => void

export type RealtimeStore = RealtimeControllerState & {
  create: (config: RealtimeClientFormValues, logger?: Logger) => void
  destroy: () => void
  syncStatus: () => void
  syncChannels: () => void
  connect: () => void
  disconnect: () => void
  createChannel: (name: string, config?: ChannelConfigValues) => void
  removeChannel: (name: string) => void
  subscribedChannels: () => ReturnType<typeof realtimeController.subscribedChannels>
  subscribe: (name: string) => void
  unsubscribe: (name: string) => void
  trackPresence: (name: string, payload: Record<string, unknown>) => void
  untrackPresence: (name: string) => void
  setAuth: (token: string) => void
}

const actions = {
  create: (config: RealtimeClientFormValues, logger?: Logger) => realtimeController.create(config, logger),
  destroy: () => realtimeController.destroy(),
  syncStatus: () => realtimeController.syncStatus(),
  syncChannels: () => realtimeController.syncChannels(),
  connect: () => realtimeController.connect(),
  disconnect: () => realtimeController.disconnect(),
  createChannel: (name: string, config?: ChannelConfigValues) => {
    realtimeController.createChannel(name, config)
  },
  removeChannel: (name: string) => {
    realtimeController.removeChannel(name)
  },
  subscribedChannels: () => realtimeController.subscribedChannels(),
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
