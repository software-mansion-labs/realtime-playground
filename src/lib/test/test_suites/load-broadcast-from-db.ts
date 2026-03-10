import { TestSuite } from "..";
import { measureThroughput, signInUser, sleep, waitForChannel } from "../helpers";

const LOAD_MESSAGES = 20
const LOAD_SETTLE_MS = 5000
const LOAD_DELIVERY_SLO = 99

export default {
  "load-broadcast-from-db": [
    {
      name: "broadcast from database throughput",
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const sendTimes = new Map<string, number>();
        const latencies: number[] = [];

        const channel = supabase
          .channel("topic:test", { config: { private: true } })
          .on("broadcast", { event: "INSERT" }, (res) => {
            const t = sendTimes.get(res.payload.record.id);
            if (t !== undefined) latencies.push(performance.now() - t);
          })
          .subscribe();

        await waitForChannel(channel);

        await Promise.all(Array.from({ length: LOAD_MESSAGES }, async () => {
          const id = crypto.randomUUID();
          sendTimes.set(id, performance.now());
          await supabase.from("broadcast_changes").insert({ id, value: crypto.randomUUID() });
        }));

        await sleep(LOAD_SETTLE_MS);

        await supabase.from("broadcast_changes").delete().in("id", [...sendTimes.keys()]);

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO);
      }
    }
  ]
} satisfies TestSuite
