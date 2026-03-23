import {
  broadcastSendSchema,
  channelConfigSchema,
  channelFormSchema,
  createBroadcastSendDefaults,
  createChannelDefaults,
  createPostgresListenerDefaults,
  postgresListenerSchema,
  type BroadcastSendValues,
  type ChannelConfigValues,
  type ChannelFormValues,
  type PostgresListenerValues,
} from '@realtime-playground/realtime-core'

export {
  broadcastSendSchema,
  channelConfigSchema,
  channelFormSchema,
  postgresListenerSchema,
  type BroadcastSendValues,
  type ChannelConfigValues,
  type ChannelFormValues,
  type PostgresListenerValues,
}

export const createChannelFormDefaults = (name = 'test') => createChannelDefaults(name)
export const createBroadcastSendFormDefaults = () => createBroadcastSendDefaults()
export const createPostgresListenerFormDefaults = () => createPostgresListenerDefaults()
