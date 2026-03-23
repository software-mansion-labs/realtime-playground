import assert from 'assert'
import { randomId, signInUser, waitFor, waitForChannel } from '../helpers'
import { TestSuite } from '../types'

export default {
  'broadcast changes': [
    {
      name: 'authenticated user receives INSERT broadcast change',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = randomId()
        const value = randomId()
        let result: Record<string, unknown> | null = null

        const channel = supabase
          .channel('topic:test', { config: { private: true } })
          .on('broadcast', { event: 'INSERT' }, (res) => (result = res as Record<string, unknown>))
          .subscribe()

        await waitForChannel(channel)
        await supabase.from('broadcast_changes').insert({ value, id })
        await waitFor(() => result)

        const payload = result as unknown as {
          payload: {
            record: { id: string; value: string }
            old_record: null
            operation: string
            schema: string
            table: string
          }
        }
        assert.strictEqual(payload.payload.record.id, id)
        assert.strictEqual(payload.payload.record.value, value)
        assert.strictEqual(payload.payload.old_record, null)
        assert.strictEqual(payload.payload.operation, 'INSERT')
        assert.strictEqual(payload.payload.schema, 'public')
        assert.strictEqual(payload.payload.table, 'broadcast_changes')
      },
    },
    {
      name: 'authenticated user receives UPDATE broadcast change',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = randomId()
        const originalValue = randomId()
        const updatedValue = randomId()
        await supabase.from('broadcast_changes').insert({ value: originalValue, id })
        let result: Record<string, unknown> | null = null

        const channel = supabase
          .channel('topic:test', { config: { private: true } })
          .on('broadcast', { event: 'UPDATE' }, (res) => (result = res as Record<string, unknown>))
          .subscribe()

        await waitForChannel(channel)
        await supabase.from('broadcast_changes').update({ value: updatedValue }).eq('id', id)
        await waitFor(() => result)

        const payload = result as unknown as {
          payload: {
            record: { id: string; value: string }
            old_record: { id: string; value: string }
            operation: string
            schema: string
            table: string
          }
        }
        assert.strictEqual(payload.payload.record.id, id)
        assert.strictEqual(payload.payload.record.value, updatedValue)
        assert.strictEqual(payload.payload.old_record.id, id)
        assert.strictEqual(payload.payload.old_record.value, originalValue)
        assert.strictEqual(payload.payload.operation, 'UPDATE')
        assert.strictEqual(payload.payload.schema, 'public')
        assert.strictEqual(payload.payload.table, 'broadcast_changes')
      },
    },
    {
      name: 'authenticated user receives DELETE broadcast change',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = randomId()
        const value = randomId()
        await supabase.from('broadcast_changes').insert({ value, id })
        let result: Record<string, unknown> | null = null

        const channel = supabase
          .channel('topic:test', { config: { private: true } })
          .on('broadcast', { event: 'DELETE' }, (res) => (result = res as Record<string, unknown>))
          .subscribe()

        await waitForChannel(channel)
        await supabase.from('broadcast_changes').delete().eq('id', id)
        await waitFor(() => result)
      },
    },
  ],
} satisfies TestSuite
