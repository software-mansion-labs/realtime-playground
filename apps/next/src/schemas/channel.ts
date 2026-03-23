import {
  channelConfigSchema,
  channelFormSchema,
  createChannelDefaults,
  createPostgresListenerDefaults,
  postgresListenerSchema,
  type ChannelFormInput,
  type ChannelFormValues,
  type PostgresListenerValues,
} from '@realtime-playground/realtime-core'

export {
  channelConfigSchema,
  channelFormSchema,
  postgresListenerSchema,
  type ChannelFormInput,
  type ChannelFormValues,
  type PostgresListenerValues,
}

export const createChannelFormDefaults = (name = 'test') => createChannelDefaults(name)
export const createPostgresListenerFormDefaults = () => createPostgresListenerDefaults()
