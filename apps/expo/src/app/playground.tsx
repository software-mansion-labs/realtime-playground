import {
  createBroadcastSendDefaults,
  createChannelDefaults,
  createLoginDefaults,
  createPostgresListenerDefaults,
  createRealtimeClientDefaults,
  useBroadcastMessages,
  useLogMessages,
  usePostgresChanges,
  usePresenceState,
  type BroadcastSendValues,
  type ChannelFormValues,
  type LoginValues,
  type RealtimeClientFormValues,
} from '@realtime-playground/realtime-core'
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, type RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Screen,
  Separator,
  colors,
  radii,
  spacing,
  typography,
} from '../components/ui'
import { PUBLIC_REALTIME_URL, PUBLIC_SUPABASE_KEY, PUBLIC_TEST_USER_EMAIL } from '../lib/constants'
import { useRealtimeStore } from '../lib/realtime-store'
import { useSupabaseStore } from '../lib/supabase-store'

function statusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'open' || status === 'joined') return 'default'
  if (status === 'connecting' || status === 'joining' || status === 'leaving') return 'secondary'
  if (status === 'errored') return 'destructive'
  return 'outline'
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={typography.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={typography.muted}>{subtitle}</Text> : null}
    </View>
  )
}

function LabeledInput({
  label,
  value,
  onChangeText,
  ...rest
}: {
  label: string
  value: string
  onChangeText: (value: string) => void
  multiline?: boolean
  secureTextEntry?: boolean
  placeholder?: string
}) {
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <Input value={value} onChangeText={onChangeText} autoCapitalize="none" {...rest} />
    </View>
  )
}

function ToggleField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <View style={styles.toggleRow}>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <Text style={typography.body}>{label}</Text>
    </View>
  )
}

function ClientSection({
  form,
  onChange,
  onSubmit,
  status,
  disabled,
  onConnect,
  onDisconnect,
  onDelete,
}: {
  form: RealtimeClientFormValues
  onChange: (patch: Partial<RealtimeClientFormValues>) => void
  onSubmit: () => void
  status?: string
  disabled: boolean
  onConnect: () => void
  onDisconnect: () => void
  onDelete: () => void
}) {
  return (
    <Card>
      <Card.Header>
        <SectionTitle title="Realtime Client" subtitle="Shared controller from realtime-core" />
      </Card.Header>
      <Card.Content style={styles.formStack}>
        <LabeledInput
          label="Realtime URL"
          value={form.url}
          onChangeText={(url) => onChange({ url })}
        />
        <LabeledInput
          label="API Key"
          value={form.apiKey}
          onChangeText={(apiKey) => onChange({ apiKey })}
        />
        <View style={styles.inlineRow}>
          <View style={styles.compactField}>
            <Label>VSN</Label>
            <View style={styles.toggleGroup}>
              {['1.0.0', '2.0.0'].map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={form.vsn === value ? 'default' : 'outline'}
                  onPress={() => onChange({ vsn: value as RealtimeClientFormValues['vsn'] })}
                >
                  {value}
                </Button>
              ))}
            </View>
          </View>
          <View style={styles.compactField}>
            <Label>Worker</Label>
            <ToggleField
              label="Enabled"
              checked={form.worker}
              onCheckedChange={(worker) => onChange({ worker })}
            />
          </View>
        </View>
        <View style={styles.inlineRow}>
          <View style={styles.compactField}>
            <Label>Heartbeat (ms)</Label>
            <Input
              value={form.heartbeatIntervalMs ?? ''}
              onChangeText={(heartbeatIntervalMs) => onChange({ heartbeatIntervalMs })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.compactField}>
            <Label>Timeout (ms)</Label>
            <Input
              value={form.timeout ?? ''}
              onChangeText={(timeout) => onChange({ timeout })}
              keyboardType="numeric"
            />
          </View>
        </View>
        {!disabled ? (
          <Button onPress={onSubmit}>Create client</Button>
        ) : (
          <View style={styles.inlineRow}>
            <Button
              variant={status === 'open' ? 'secondary' : 'default'}
              onPress={status === 'open' ? onDisconnect : onConnect}
            >
              {status === 'open' ? 'Disconnect' : 'Connect'}
            </Button>
            <Button variant="destructive" onPress={onDelete}>
              Delete
            </Button>
            {status ? <Badge variant={statusVariant(status)}>{status}</Badge> : null}
          </View>
        )}
        <Text style={typography.caption}>Default anon key: {PUBLIC_SUPABASE_KEY}</Text>
      </Card.Content>
    </Card>
  )
}

function AuthSection({
  form,
  onChange,
}: {
  form: LoginValues
  onChange: (patch: Partial<LoginValues>) => void
}) {
  const { email, login, logout, token, userId } = useSupabaseStore()

  return (
    <Card>
      <Card.Header>
        <SectionTitle title="User Authentication" subtitle="Shared auth controller" />
      </Card.Header>
      <Card.Content style={styles.formStack}>
        {!userId ? (
          <>
            <LabeledInput
              label="Email"
              value={form.email}
              onChangeText={(nextEmail) => onChange({ email: nextEmail })}
            />
            <LabeledInput
              label="Password"
              value={form.password}
              onChangeText={(password) => onChange({ password })}
              secureTextEntry
            />
            <Button onPress={() => void login(form.email, form.password)}>Log in</Button>
            <Text style={typography.caption}>
              Tip: set `PUBLIC_TEST_USER_EMAIL` to prefill the email.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Authenticated</Text>
              <Text style={typography.caption}>User ID: {userId}</Text>
              <Text style={typography.caption}>Email: {email}</Text>
              {token ? (
                <Text style={typography.caption}>Token received for realtime auth.</Text>
              ) : null}
            </View>
            <Button variant="destructive" onPress={() => void logout()}>
              Log out
            </Button>
          </>
        )}
      </Card.Content>
    </Card>
  )
}

function ChannelSection({
  form,
  onChange,
  onSubmit,
  disabled,
}: {
  form: ChannelFormValues
  onChange: (updater: (current: ChannelFormValues) => ChannelFormValues) => void
  onSubmit: () => void
  disabled: boolean
}) {
  return (
    <Card>
      <Card.Header>
        <SectionTitle
          title="Channel Creation"
          subtitle={disabled ? 'Create a client first.' : 'Create shared realtime channels.'}
        />
      </Card.Header>
      <Card.Content style={[styles.formStack, disabled && styles.disabled]}>
        <LabeledInput
          label="Channel Name"
          value={form.name}
          onChangeText={(name) => onChange((current) => ({ ...current, name }))}
        />
        <ToggleField
          label="Private channel"
          checked={form.config.private}
          onCheckedChange={(value) =>
            onChange((current) => ({
              ...current,
              config: { ...current.config, private: value },
            }))
          }
        />
        <View style={styles.groupBox}>
          <Text style={styles.groupTitle}>Broadcast Configuration</Text>
          <ToggleField
            label="Acknowledge sends"
            checked={form.config.broadcast.ack}
            onCheckedChange={(ack) =>
              onChange((current) => ({
                ...current,
                config: {
                  ...current.config,
                  broadcast: { ...current.config.broadcast, ack },
                },
              }))
            }
          />
          <ToggleField
            label="Receive own messages"
            checked={form.config.broadcast.self}
            onCheckedChange={(self) =>
              onChange((current) => ({
                ...current,
                config: {
                  ...current.config,
                  broadcast: { ...current.config.broadcast, self },
                },
              }))
            }
          />
        </View>
        <View style={styles.groupBox}>
          <Text style={styles.groupTitle}>Presence Configuration</Text>
          <ToggleField
            label="Enable presence"
            checked={form.config.presence.enabled}
            onCheckedChange={(enabled) =>
              onChange((current) => ({
                ...current,
                config: {
                  ...current.config,
                  presence: { ...current.config.presence, enabled },
                },
              }))
            }
          />
          {form.config.presence.enabled ? (
            <LabeledInput
              label="Presence Key"
              value={form.config.presence.key ?? ''}
              onChangeText={(key) =>
                onChange((current) => ({
                  ...current,
                  config: {
                    ...current.config,
                    presence: { ...current.config.presence, key },
                  },
                }))
              }
            />
          ) : null}
        </View>
        <Button onPress={onSubmit} disabled={disabled}>
          Create channel
        </Button>
      </Card.Content>
    </Card>
  )
}

function ChannelCard({
  channel,
  name,
  addBroadcastListener,
  addPresenceListener,
  addPostgresChangesListener,
}: {
  channel: RealtimeChannel
  name: string
  addBroadcastListener: (name: string, event: string) => void
  addPresenceListener: (name: string) => void
  addPostgresChangesListener: (
    name: string,
    schema: string,
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    table?: string,
  ) => void
}) {
  const [listenerCounts, setListenerCounts] = useState({ broadcast: 0, presence: 0, postgres: 0 })
  const [broadcastEvent, setBroadcastEvent] = useState(createBroadcastSendDefaults().event)
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [presencePayload, setPresencePayload] = useState('{"message":"hello"}')
  const [postgresForm, setPostgresForm] = useState(createPostgresListenerDefaults())
  const [tracked, setTracked] = useState(Object.keys(channel.presenceState()).length > 0)
  const realtime = useRealtimeStore()

  const subscribed = channel.state === 'joined'

  return (
    <Card>
      <Card.Header>
        <View style={styles.channelHeader}>
          <View style={styles.channelHeaderCopy}>
            <Card.Title>{name}</Card.Title>
            <View style={styles.inlineRow}>
              <Badge variant={statusVariant(channel.state)}>{channel.state}</Badge>
              {tracked && subscribed ? <Badge variant="secondary">Tracked</Badge> : null}
            </View>
          </View>
          <View style={styles.listenerBadgeRow}>
            {listenerCounts.broadcast > 0 ? (
              <Badge variant="outline">B {listenerCounts.broadcast}</Badge>
            ) : null}
            {listenerCounts.presence > 0 ? (
              <Badge variant="outline">P {listenerCounts.presence}</Badge>
            ) : null}
            {listenerCounts.postgres > 0 ? (
              <Badge variant="outline">PG {listenerCounts.postgres}</Badge>
            ) : null}
          </View>
        </View>
      </Card.Header>
      <Card.Content style={styles.formStack}>
        <View style={styles.inlineRow}>
          {subscribed ? (
            <Button variant="outline" onPress={() => realtime.unsubscribe(name)}>
              Unsubscribe
            </Button>
          ) : (
            <Button onPress={() => realtime.subscribe(name)}>Subscribe</Button>
          )}
          <Button variant="destructive" onPress={() => realtime.removeChannel(name)}>
            Remove
          </Button>
        </View>

        <Separator />

        <View style={styles.field}>
          <Label>Broadcast listener event</Label>
          <View style={styles.inlineRow}>
            <Input value={broadcastEvent} onChangeText={setBroadcastEvent} autoCapitalize="none" />
            <Button
              variant="secondary"
              onPress={() => {
                addBroadcastListener(name, broadcastEvent || '*')
                setListenerCounts((current) => ({ ...current, broadcast: current.broadcast + 1 }))
              }}
            >
              Add
            </Button>
          </View>
        </View>

        <View style={styles.field}>
          <Label>Presence listeners</Label>
          <Button
            variant="secondary"
            onPress={() => {
              addPresenceListener(name)
              setListenerCounts((current) => ({ ...current, presence: current.presence + 1 }))
            }}
          >
            Add presence listener
          </Button>
        </View>

        <View style={styles.field}>
          <Label>Postgres listener</Label>
          <View style={styles.formStack}>
            <Input
              value={postgresForm.schema}
              onChangeText={(schema) => setPostgresForm((current) => ({ ...current, schema }))}
            />
            <Input
              value={postgresForm.table ?? ''}
              onChangeText={(table) => setPostgresForm((current) => ({ ...current, table }))}
              placeholder="table (optional)"
            />
            <View style={styles.toggleGroup}>
              {Object.values(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT).map((event) => (
                <Button
                  key={event}
                  size="sm"
                  variant={postgresForm.event === event ? 'default' : 'outline'}
                  onPress={() =>
                    setPostgresForm((current) => ({
                      ...current,
                      event,
                    }))
                  }
                >
                  {event}
                </Button>
              ))}
            </View>
            <Button
              variant="secondary"
              onPress={() => {
                addPostgresChangesListener(
                  name,
                  postgresForm.schema,
                  postgresForm.event,
                  postgresForm.table,
                )
                setListenerCounts((current) => ({ ...current, postgres: current.postgres + 1 }))
              }}
            >
              Add postgres listener
            </Button>
          </View>
        </View>

        {subscribed ? (
          <>
            <Separator />

            <View style={styles.field}>
              <Label>Track presence JSON</Label>
              <TextInput
                multiline
                style={styles.textArea}
                value={presencePayload}
                onChangeText={setPresencePayload}
              />
              <View style={styles.inlineRow}>
                <Button
                  variant="secondary"
                  onPress={() => {
                    try {
                      const payload = JSON.parse(presencePayload) as Record<string, unknown>
                      realtime.trackPresence(name, payload)
                      setTracked(true)
                    } catch {
                      realtime.trackPresence(name, { message: presencePayload })
                      setTracked(true)
                    }
                  }}
                >
                  Track presence
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    realtime.untrackPresence(name)
                    setTracked(false)
                  }}
                >
                  Untrack
                </Button>
              </View>
            </View>

            <View style={styles.field}>
              <Label>Broadcast message</Label>
              <Input
                value={broadcastEvent}
                onChangeText={setBroadcastEvent}
                autoCapitalize="none"
              />
              <Input value={broadcastMessage} onChangeText={setBroadcastMessage} />
              <Button
                onPress={() => {
                  const values: BroadcastSendValues = {
                    event: broadcastEvent,
                    message: broadcastMessage,
                  }
                  void channel.send({
                    type: 'broadcast',
                    event: values.event,
                    payload: { message: values.message },
                  })
                  setBroadcastMessage('')
                }}
              >
                Send broadcast
              </Button>
            </View>
          </>
        ) : null}
      </Card.Content>
    </Card>
  )
}

function DataListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content style={styles.dataList}>
        {items.length === 0 ? (
          <Text style={typography.muted}>No data yet.</Text>
        ) : (
          items.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.resultBlock}>
              <Text style={styles.monoText}>{item}</Text>
            </View>
          ))
        )}
      </Card.Content>
    </Card>
  )
}

export default function PlaygroundScreen() {
  const status = useRealtimeStore((state) => state.status)
  const socketConfig = useRealtimeStore((state) => state.socketConfig)
  const channels = useRealtimeStore((state) => state.channels)

  const { addLog, clear: clearLogs, logs } = useLogMessages()
  const {
    addListener: addBroadcastCollector,
    clear: clearBroadcastMessages,
    messages,
  } = useBroadcastMessages()
  const {
    addListener: addPostgresCollector,
    changes,
    clear: clearPostgresChanges,
  } = usePostgresChanges()
  const {
    addListener: addPresenceCollector,
    clear: clearPresenceState,
    presenceState,
  } = usePresenceState()

  const [clientForm, setClientForm] = useState(
    createRealtimeClientDefaults({
      realtimeUrl: PUBLIC_REALTIME_URL,
      supabaseKey: PUBLIC_SUPABASE_KEY,
    }),
  )
  const [loginForm, setLoginForm] = useState(
    createLoginDefaults({
      testUserEmail: PUBLIC_TEST_USER_EMAIL,
    }),
  )
  const [channelForm, setChannelForm] = useState(createChannelDefaults('test'))

  useEffect(() => {
    useSupabaseStore.getState().init()
    const interval = setInterval(() => useRealtimeStore.getState().syncStatus(), 500)
    useRealtimeStore.getState().syncStatus()

    return () => {
      clearInterval(interval)
      useRealtimeStore.getState().destroy()
    }
  }, [])

  const addBroadcastListener = useCallback(
    (name: string, event: string) => {
      const channel = useRealtimeStore.getState().channels.get(name)
      if (!channel) return
      addBroadcastCollector(channel, name, event)
      useRealtimeStore.getState().syncChannels()
    },
    [addBroadcastCollector],
  )

  const addPresenceListener = useCallback(
    (name: string) => {
      const channel = useRealtimeStore.getState().channels.get(name)
      if (!channel) return
      addPresenceCollector(channel, name)
      useRealtimeStore.getState().syncChannels()
    },
    [addPresenceCollector],
  )

  const addPostgresChangesListener = useCallback(
    (
      name: string,
      schema: string,
      event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
      table?: string,
    ) => {
      const channel = useRealtimeStore.getState().channels.get(name)
      if (!channel) return
      addPostgresCollector(channel, name, event, schema, table)
      useRealtimeStore.getState().syncChannels()
    },
    [addPostgresCollector],
  )

  const logItems = useMemo(
    () =>
      logs.map(
        (entry) =>
          `${entry.timestamp} [${entry.kind}] ${entry.message}\n${JSON.stringify(entry.data ?? {}, null, 2)}`,
      ),
    [logs],
  )
  const broadcastItems = useMemo(
    () =>
      messages.map(
        (entry) =>
          `${entry.timestamp} ${entry.channel}/${entry.event}\n${JSON.stringify(entry.payload, null, 2)}`,
      ),
    [messages],
  )
  const postgresItems = useMemo(
    () =>
      changes.map(
        (entry) =>
          `${entry.timestamp} ${entry.channel}/${entry.eventType}\n${JSON.stringify({ old: entry.old, new: entry.new }, null, 2)}`,
      ),
    [changes],
  )
  const presenceItems = useMemo(
    () =>
      Object.entries(presenceState).map(
        ([channelName, state]) => `${channelName}\n${JSON.stringify(state, null, 2)}`,
      ),
    [presenceState],
  )

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.screenContent}>
        <View style={styles.screenHeader}>
          <Text style={typography.title}>Playground</Text>
          <Text style={typography.muted}>Shared runtime, native UI.</Text>
        </View>

        <ClientSection
          form={clientForm}
          onChange={(patch) => setClientForm((current) => ({ ...current, ...patch }))}
          onSubmit={() => useRealtimeStore.getState().create(clientForm, addLog)}
          onConnect={() => useRealtimeStore.getState().connect()}
          onDisconnect={() => useRealtimeStore.getState().disconnect()}
          onDelete={() => useRealtimeStore.getState().destroy()}
          disabled={!!socketConfig}
          status={status}
        />

        <AuthSection
          form={loginForm}
          onChange={(patch) => setLoginForm((current) => ({ ...current, ...patch }))}
        />

        <ChannelSection
          form={channelForm}
          onChange={(updater) => setChannelForm((current) => updater(current))}
          onSubmit={() =>
            useRealtimeStore.getState().createChannel(channelForm.name, channelForm.config)
          }
          disabled={!socketConfig}
        />

        <Card>
          <Card.Header>
            <SectionTitle title="Active Channels" subtitle={`${channels.size} channels`} />
          </Card.Header>
          <Card.Content style={styles.formStack}>
            {channels.size === 0 ? (
              <Text style={typography.muted}>No channels created yet.</Text>
            ) : (
              Array.from(channels.entries()).map(([name, channel]) => (
                <ChannelCard
                  key={name}
                  name={name}
                  channel={channel}
                  addBroadcastListener={addBroadcastListener}
                  addPresenceListener={addPresenceListener}
                  addPostgresChangesListener={addPostgresChangesListener}
                />
              ))
            )}
          </Card.Content>
        </Card>

        <View style={styles.inlineRowWrap}>
          <Button variant="outline" onPress={clearLogs}>
            Clear logs
          </Button>
          <Button variant="outline" onPress={clearBroadcastMessages}>
            Clear broadcasts
          </Button>
          <Button variant="outline" onPress={clearPostgresChanges}>
            Clear postgres
          </Button>
          <Button variant="outline" onPress={clearPresenceState}>
            Clear presence
          </Button>
        </View>

        <DataListCard title="Logs" items={logItems} />
        <DataListCard title="Broadcast Messages" items={broadcastItems} />
        <DataListCard title="Postgres Changes" items={postgresItems} />
        <DataListCard title="Presence State" items={presenceItems} />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  channelHeader: {
    gap: spacing.sm,
  },
  channelHeaderCopy: {
    gap: spacing.xs,
  },
  compactField: {
    flex: 1,
    gap: spacing.xs,
  },
  dataList: {
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  field: {
    gap: spacing.xs,
  },
  formStack: {
    gap: spacing.md,
  },
  groupBox: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    padding: spacing.md,
  },
  groupTitle: {
    ...typography.label,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  inlineRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  listenerBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  monoText: {
    color: colors.foreground,
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
  },
  resultBlock: {
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  screenContent: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  screenHeader: {
    gap: spacing.xs,
  },
  sectionTitleRow: {
    gap: spacing.xs,
  },
  statusBox: {
    backgroundColor: colors.accent,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    padding: spacing.md,
  },
  statusTitle: {
    ...typography.label,
    color: colors.primary,
  },
  textArea: {
    backgroundColor: 'transparent',
    borderColor: colors.input,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.foreground,
    fontSize: 14,
    minHeight: 84,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  toggleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
})
