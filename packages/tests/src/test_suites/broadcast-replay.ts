import assert from 'assert'
import { randomId, signInUser, sleep, waitFor, waitForChannel } from '../helpers'
import { TestSuite } from '../types'

export default {
  'broadcast replay': [
    {
      name: 'replayed messages are delivered on join',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = randomId()
        const topic = `topic:${randomId()}`
        const payload = { message: randomId() }

        const since = Date.now() - 1000
        await supabase.from('replay_check').insert({ id: randomId(), topic, event, payload })

        let result: { message: string } | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload as { message: string }))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => result)
        assert.strictEqual(result!.message, payload.message)
      },
    },
    {
      name: 'replayed messages carry meta.replayed flag',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = randomId()
        const topic = `topic:${randomId()}`

        const since = Date.now() - 1000
        await supabase
          .from('replay_check')
          .insert({ id: randomId(), topic, event, payload: { value: 1 } })

        let receivedMeta: { replayed?: boolean } | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (receivedMeta = msg.meta as { replayed?: boolean }))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => receivedMeta)
        assert.strictEqual(receivedMeta!.replayed, true)
      },
    },
    {
      name: 'messages before since are not replayed',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = randomId()
        const topic = `topic:${randomId()}`

        await supabase
          .from('replay_check')
          .insert({ id: randomId(), topic, event, payload: { value: 'old' } })
        await sleep(1000)
        const since = Date.now()

        let result: Record<string, unknown> | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 25 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload as Record<string, unknown>))
          .subscribe()

        await waitForChannel(receiver)

        await sleep(2000)
        assert.strictEqual(result, null)
      },
    },
  ],
} satisfies TestSuite
