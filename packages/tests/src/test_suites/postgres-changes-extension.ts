import assert from 'assert'
import {
  executeDelete,
  executeInsert,
  executeUpdate,
  randomId,
  signInUser,
  waitFor,
  waitForChannel,
  waitForPostgresChannel,
} from '../helpers'
import { TestSuite } from '../types'
import { BROADCAST_CONFIG } from './const'

type PgChangePayload = {
  eventType: string
  new?: { id: number }
  old?: { id: number }
}

export default {
  'postgres changes extension': [
    {
      name: 'user is able to receive INSERT only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let subscribed: string | null = null
        let result: PgChangePayload | null = null
        const topic = `topic:${randomId()}`

        const previousId = await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${previousId + 1}`,
            },
            (payload) => (result = payload as unknown as PgChangePayload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        await waitFor(() => result !== null)
        const insertPayload = result as unknown as PgChangePayload

        assert.equal(typeof insertPayload.new!.id, 'number')
        assert.equal(insertPayload.eventType, 'INSERT')
        assert.equal(insertPayload.new!.id, previousId + 1)
      },
    },
    {
      name: 'user is able to receive UPDATE only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let result: PgChangePayload | null = null
        let subscribed: string | null = null
        const topic = `topic:${randomId()}`

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${mainId}`,
            },
            (payload) => (result = payload as unknown as PgChangePayload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        executeUpdate(supabase, 'pg_changes', mainId)
        executeUpdate(supabase, 'pg_changes', fakeId)
        executeUpdate(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)
        const updatePayload = result as unknown as PgChangePayload
        assert.equal(typeof updatePayload.new!.id, 'number')
        assert.equal(updatePayload.eventType, 'UPDATE')
        assert.equal(updatePayload.new!.id, mainId)
      },
    },
    {
      name: 'user is able to receive DELETE only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let result: PgChangePayload | null = null
        let subscribed: string | null = null
        const topic = `topic:${randomId()}`

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${mainId}`,
            },
            (payload) => (result = payload as unknown as PgChangePayload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        executeDelete(supabase, 'pg_changes', mainId)
        executeDelete(supabase, 'pg_changes', fakeId)
        executeDelete(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)
        const deletePayload = result as unknown as PgChangePayload
        assert.equal(typeof deletePayload.old!.id, 'number')
        assert.equal(deletePayload.eventType, 'DELETE')
        assert.equal(deletePayload.old!.id, mainId)
      },
    },
    {
      name: 'user receives INSERT, UPDATE and DELETE concurrently',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        let insertResult: { eventType: string } | null = null
        let updateResult: { eventType: string } | null = null
        let deleteResult: { eventType: string } | null = null

        const insertId = await executeInsert(supabase, 'pg_changes')
        const updateId = await executeInsert(supabase, 'pg_changes')
        const deleteId = await executeInsert(supabase, 'pg_changes')

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${insertId + 3}`,
            },
            (payload) => (insertResult = payload as { eventType: string }),
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pg_changes', filter: `id=eq.${updateId}` },
            (payload) => (updateResult = payload as { eventType: string }),
          )
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'pg_changes', filter: `id=eq.${deleteId}` },
            (payload) => (deleteResult = payload as { eventType: string }),
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all([
          executeInsert(supabase, 'pg_changes'),
          executeUpdate(supabase, 'pg_changes', updateId),
          executeDelete(supabase, 'pg_changes', deleteId),
        ])
        await Promise.all([
          waitFor(() => insertResult),
          waitFor(() => updateResult),
          waitFor(() => deleteResult),
        ])
        assert.strictEqual((insertResult as unknown as { eventType: string }).eventType, 'INSERT')
        assert.strictEqual((updateResult as unknown as { eventType: string }).eventType, 'UPDATE')
        assert.strictEqual((deleteResult as unknown as { eventType: string }).eventType, 'DELETE')
      },
    },
  ],
} satisfies TestSuite
