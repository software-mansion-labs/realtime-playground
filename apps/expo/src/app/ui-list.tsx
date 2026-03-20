import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Collapsible,
  Dialog,
  Form,
  Input,
  Label,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Table,
  Textarea,
  Toaster,
  colors,
  toast,
  typography,
} from '../components/ui'

type DemoFormValues = {
  channelName: string
  email: string
  notes: string
}

export default function UIListScreen() {
  const [checked, setChecked] = React.useState(true)
  const [selectedScope, setSelectedScope] = React.useState('private')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const form = useForm<DemoFormValues>({
    defaultValues: {
      channelName: 'realtime-room',
      email: 'owner@example.com',
      notes: 'Native recreation of the Next app UI primitives.',
    },
  })

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="light" />
      <Toaster />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={typography.title}>UI primitives</Text>
        </View>

        <Card.Root>
          <Card.Header>
            <Card.Title>Buttons, badges, loading</Card.Title>
            <Card.Description>
              Variant and state coverage for the common action primitives.
            </Card.Description>
          </Card.Header>
          <Card.Content style={styles.stackMd}>
            <View style={styles.rowWrap}>
              <Button onPress={() => toast.success('Primary action completed')}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link button</Button>
              <Button size="icon" onPress={() => toast.info('Icon button pressed')}>
                +
              </Button>
            </View>
            <View style={styles.rowWrap}>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Danger</Badge>
              <Badge variant="ghost">Ghost</Badge>
              <Badge variant="link">Link badge</Badge>
            </View>
            <View style={styles.rowWrap}>
              <Spinner />
              <Skeleton style={styles.skeletonShort} />
              <Skeleton style={styles.skeletonLong} />
            </View>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Inputs, labels, form</Card.Title>
            <Card.Description>
              Text inputs, textarea, React Hook Form bindings, and validation messaging.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Form.Root {...form}>
              <View style={styles.stackLg}>
                <Form.Field
                  control={form.control}
                  name="channelName"
                  rules={{ required: 'Channel name is required.' }}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Channel name</Form.Label>
                      <Form.Control>
                        <Input
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      </Form.Control>
                      <Form.Description>
                        Used as the room identifier for the realtime session.
                      </Form.Description>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  control={form.control}
                  name="email"
                  rules={{
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Enter a valid email address.',
                    },
                    required: 'Owner email is required.',
                  }}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Owner email</Form.Label>
                      <Form.Control>
                        <Input
                          autoCapitalize="none"
                          keyboardType="email-address"
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control>
                        <Textarea
                          onBlur={field.onBlur}
                          onChangeText={field.onChange}
                          value={field.value}
                        />
                      </Form.Control>
                      <Form.Description>
                        Multiline body text uses the same surface tokens as `Input`.
                      </Form.Description>
                    </Form.Item>
                  )}
                />

                <Button
                  onPress={form.handleSubmit((values) => {
                    toast.success('Form submitted', {
                      description: `${values.channelName} | ${values.email}`,
                    })
                  })}
                >
                  Submit form
                </Button>
              </View>
            </Form.Root>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Select, checkbox, separator</Card.Title>
            <Card.Description>
              State-driven controls with the same high-level shape as the web version.
            </Card.Description>
          </Card.Header>
          <Card.Content style={styles.stackMd}>
            <View style={styles.stackSm}>
              <Label>Subscription scope</Label>
              <Select.Root onValueChange={setSelectedScope} value={selectedScope}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose a scope" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Channel visibility</Select.Label>
                    <Select.Item value="private">Private</Select.Item>
                    <Select.Item value="team">Team</Select.Item>
                    <Select.Item value="public">Public</Select.Item>
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    <Select.Label>Special cases</Select.Label>
                    <Select.Item value="presence-only">Presence only</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </View>
            <Separator />
            <View style={styles.checkboxRow}>
              <Checkbox checked={checked} onCheckedChange={setChecked} />
              <View style={styles.stackXs}>
                <Label>Enable optimistic updates</Label>
                <Text style={typography.caption}>
                  Mirrors the compact checkbox treatment from the Next app.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Collapsible and dialog</Card.Title>
            <Card.Description>
              Interactive disclosure and modal surfaces for mobile flows.
            </Card.Description>
          </Card.Header>
          <Card.Content style={styles.stackMd}>
            <Collapsible.Root defaultOpen>
              <Collapsible.Trigger>
                <Button variant="outline">Toggle advanced configuration</Button>
              </Collapsible.Trigger>
              <Collapsible.Content style={styles.collapsibleContent}>
                <Text style={typography.body}>
                  Use this section for lower-frequency settings such as channel replay, presence
                  limits, or authorization mode.
                </Text>
              </Collapsible.Content>
            </Collapsible.Root>

            <Dialog.Root onOpenChange={setDialogOpen} open={dialogOpen}>
              <Dialog.Trigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Realtime configuration</Dialog.Title>
                  <Dialog.Description>
                    The React Native `Dialog` uses a transparent `Modal` and shared design tokens
                    from the web app.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer showCloseButton>
                  <Button
                    onPress={() => {
                      toast.warning('Settings saved locally')
                      setDialogOpen(false)
                    }}
                  >
                    Save changes
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Table</Card.Title>
            <Card.Description>
              Horizontal-scrollable data table for mobile layouts.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head flex={1.2}>Channel</Table.Head>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head flex={1.6}>Last event</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell flex={1.2}>realtime-room</Table.Cell>
                  <Table.Cell>Broadcast</Table.Cell>
                  <Table.Cell>
                    <Badge>Live</Badge>
                  </Table.Cell>
                  <Table.Cell flex={1.6}>presence sync completed</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell flex={1.2}>metrics-feed</Table.Cell>
                  <Table.Cell>Postgres</Table.Cell>
                  <Table.Cell>
                    <Badge variant="secondary">Idle</Badge>
                  </Table.Cell>
                  <Table.Cell flex={1.6}>waiting for database change</Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Caption>Compact mobile alternative to the web table primitives.</Table.Caption>
            </Table.Root>
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" onPress={() => toast.info('Table refresh requested')}>
              Refresh rows
            </Button>
          </Card.Footer>
        </Card.Root>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  collapsibleContent: {
    marginTop: 12,
  },
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 48,
  },
  hero: {
    gap: 10,
  },
  rowWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  skeletonLong: {
    height: 12,
    width: 160,
  },
  skeletonShort: {
    height: 12,
    width: 96,
  },
  stackLg: {
    gap: 18,
  },
  stackMd: {
    gap: 14,
  },
  stackSm: {
    gap: 8,
  },
  stackXs: {
    gap: 4,
  },
})
