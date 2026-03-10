import { TestSuite } from '..'
import { measureThroughput, sleep, waitFor, waitForChannel } from '../helpers'

const BROADCAST_CONFIG = { config: { broadcast: { self: true } } }

export default {
  connection: [
    {
      name: 'first connect latency',
      body: async (supabase) => {
        const channel = supabase.channel('topic:' + crypto.randomUUID()).subscribe()

        const delay = await waitForChannel(channel)

        return `${delay}ms`
      },
    },
    {
      name: 'broadcast message throughput',
      body: async (supabase) => {
        const MESSAGES = 50
        const SETTLE_MS = 3000
        const DELIVERY_SLO = 99

        const topic = 'topic:' + crypto.randomUUID()
        const event = 'load'
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const t = sendTimes.get(payload.seq)
            if (t !== undefined) latencies.push(performance.now() - t)
          })
          .subscribe()

        await waitForChannel(channel)

        for (let i = 0; i < MESSAGES; i++) {
          sendTimes.set(i, performance.now())
          await channel.send({ type: 'broadcast', event, payload: { seq: i } })
        }

        await sleep(SETTLE_MS)
        return measureThroughput(latencies, MESSAGES, DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
