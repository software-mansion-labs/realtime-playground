import { measureThroughput, now, randomId, signInUser, waitForChannel } from '../helpers'
import { TestSuite } from '../types'
import { LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast-from-db': [
    {
      name: 'broadcast from database throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const sendTimes = new Map<string, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel('topic:test', { config: { private: true } })
          .on('broadcast', { event: 'INSERT' }, (res) => {
            const sentAt = sendTimes.get(res.payload.record.id as string)
            if (sentAt !== undefined) latencies.push(now() - sentAt)
          })
          .subscribe()

        await waitForChannel(channel)

        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, async () => {
            const id = randomId()
            sendTimes.set(id, now())
            await supabase.from('broadcast_changes').insert({ id, value: randomId() })
          }),
        )

        await supabase
          .from('broadcast_changes')
          .delete()
          .in('id', [...sendTimes.keys()])

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
