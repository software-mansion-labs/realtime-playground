import { TestSuite } from '..'
import { measureThroughput, sleep, waitFor } from '../helpers'

const BROADCAST_CONFIG = { config: { broadcast: { self: true } } }

export default {
  connection: [
    {
      name: 'first connect latency',
      body: async (supabase) => {
        const channel = supabase.channel('topic:' + crypto.randomUUID()).subscribe()

        const delay = await waitFor(() => channel.state == 'joined')

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

        await waitFor(() => channel.state == 'joined')

        for (let i = 0; i < MESSAGES; i++) {
          sendTimes.set(i, performance.now())
          await channel.send({ type: 'broadcast', event, payload: { seq: i } })
        }

        await sleep(SETTLE_MS)
        const results = measureThroughput(latencies, MESSAGES, 'messages', DELIVERY_SLO)

        let res = ''

        for (const result of results) {
          res += `${result.label}: ${result.value.toFixed(2)}${result.unit}\n`
        }

        return res
      },
    },
  ],
} satisfies TestSuite
