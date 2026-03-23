import { RealtimeChannel, RealtimeClient, type REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import type { ChannelConfigValues, RealtimeClientFormValues } from './schemas'
import { createExternalStore, useExternalStoreSnapshot } from './store'

export type SocketStatus = 'closed' | 'connecting' | 'open' | 'closing'

type Logger = (kind: string, msg: string, data: unknown) => void

export type FeedbackLevel = 'success' | 'error' | 'warning' | 'info'

export type RealtimeFeedbackEvent = {
  level: FeedbackLevel
  message: string
  data?: unknown
}

export type RealtimeControllerState = {
  client: RealtimeClient | null
  socketConfig: RealtimeClientFormValues | null
  status: SocketStatus
  channels: Map<string, RealtimeChannel>
}

const createInitialState = (): RealtimeControllerState => ({
  client: null,
  socketConfig: null,
  status: 'closed',
  channels: new Map(),
})

export class RealtimeController {
  private readonly store = createExternalStore<RealtimeControllerState>(createInitialState())
  private readonly eventListeners = new Set<(event: RealtimeFeedbackEvent) => void>()

  getState = () => this.store.getState()

  subscribe = (listener: () => void) => this.store.subscribe(listener)

  onFeedback(listener: (event: RealtimeFeedbackEvent) => void) {
    this.eventListeners.add(listener)
    return () => {
      this.eventListeners.delete(listener)
    }
  }

  private emit(event: RealtimeFeedbackEvent) {
    this.eventListeners.forEach((listener) => listener(event))
  }

  private setState(next: RealtimeControllerState | ((prev: RealtimeControllerState) => RealtimeControllerState)) {
    this.store.setState(next)
  }

  create(config: RealtimeClientFormValues, logger?: Logger) {
    this.getState().client?.disconnect()

    const timeout = config.timeout ? parseInt(config.timeout, 10) : undefined
    const heartbeatIntervalMs = config.heartbeatIntervalMs
      ? parseInt(config.heartbeatIntervalMs, 10)
      : undefined

    const client = new RealtimeClient(config.url, {
      params: {
        apikey: config.apiKey,
        ...(config.vsn ? { vsn: config.vsn } : {}),
      },
      worker: config.worker,
      ...(timeout !== undefined ? { timeout } : {}),
      ...(heartbeatIntervalMs !== undefined ? { heartbeatIntervalMs } : {}),
      logger,
    })

    this.setState({
      client,
      socketConfig: config,
      status: 'closed',
      channels: new Map(),
    })
  }

  destroy() {
    this.getState().client?.disconnect()
    this.setState(createInitialState())
  }

  syncStatus() {
    const { client } = this.getState()

    this.setState((prev) => ({
      ...prev,
      status: client ? (client.connectionState() as SocketStatus) : 'closed',
    }))
  }

  syncChannels() {
    const { client } = this.getState()

    this.setState((prev) => ({
      ...prev,
      channels: client ? new Map(client.getChannels().map((channel) => [channel.subTopic, channel])) : new Map(),
    }))
  }

  connect() {
    this.getState().client?.connect()
    this.syncStatus()
  }

  disconnect() {
    this.getState().client?.disconnect()
    this.syncStatus()
  }

  createChannel(name: string, config?: ChannelConfigValues) {
    const { client, channels } = this.getState()

    if (!client) {
      this.emit({ level: 'warning', message: 'Create a realtime client before creating channels.' })
      return null
    }

    if (channels.has(name)) {
      this.emit({ level: 'warning', message: `Channel "${name}" already exists` })
      return null
    }

    const channel = client.channel(name, config ? { config } : undefined)
    channel.on('system', {}, (payload) => {
      this.emit({
        level: payload.status === 'ok' ? 'success' : 'error',
        message: `[SYSTEM] ${payload.message}`,
        data: payload,
      })
    })

    this.syncChannels()
    return channel
  }

  removeChannel(name: string) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[REMOVE] Channel "${name}" not found` })
      return false
    }

    channel.unsubscribe()
    this.syncChannels()
    return true
  }

  subscribedChannels() {
    return Array.from(this.getState().channels.entries()).filter(([, channel]) => channel.state === 'joined')
  }

  subscribeToChannel(name: string) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[SUBSCRIBE] Channel "${name}" not found` })
      return false
    }

    channel.subscribe((status, error) => {
      if (error) {
        this.emit({ level: 'error', message: `[SUBSCRIBE] Error: ${error.message}`, data: error })
      } else if (status === 'SUBSCRIBED') {
        this.emit({ level: 'success', message: `[SUBSCRIBE] Subscribed to "${name}"` })
      }

      this.syncChannels()
      this.syncStatus()
    })

    this.syncChannels()
    return true
  }

  unsubscribe(name: string) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[UNSUBSCRIBE] Channel "${name}" not found` })
      return false
    }

    channel.unsubscribe()
    this.syncChannels()
    return true
  }

  trackPresence(name: string, payload: Record<string, unknown>) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[TRACK] Channel "${name}" not found` })
      return null
    }

    return channel.track(payload)
  }

  untrackPresence(name: string) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[UNTRACK] Channel "${name}" not found` })
      return null
    }

    return channel.untrack()
  }

  setAuth(token: string) {
    return this.getState().client?.setAuth(token)
  }

  addPostgresChangesListener(
    name: string,
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    schema: string,
    table?: string,
    callback?: Parameters<RealtimeChannel['on']>[2],
  ) {
    const channel = this.getState().channels.get(name)

    if (!channel) {
      this.emit({ level: 'error', message: `[LISTEN] Channel "${name}" not found` })
      return null
    }

    channel.on('postgres_changes', { event, schema, table }, callback ?? (() => {}))
    this.syncChannels()
    return channel
  }
}

export const createRealtimeController = () => new RealtimeController()

export const useRealtimeControllerState = (controller: RealtimeController) =>
  useExternalStoreSnapshot({
    getState: controller.getState,
    subscribe: controller.subscribe,
    setState: () => {},
  })
