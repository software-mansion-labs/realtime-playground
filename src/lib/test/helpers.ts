import type { SupabaseClient } from '@supabase/supabase-js'
import assert from 'assert'

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const waitFor = async <T>(cond: () => T, timeout = 5000, retryDelay = 200) => {
  const start = Date.now()
  const deadline = start + timeout

  while (true) {
    if (cond()) {
      return Date.now() - start
    }
    if (Date.now() > deadline) {
      throw new Error('timeout')
    }
    await sleep(50)
  }
}

export type Metric = { label: string; value: number; unit: string }

export const measureThroughput = (
  latencies: number[],
  total: number,
  label: string,
  slo: number,
): Metric[] => {
  const delivered = latencies.length
  const deliveryRate = (delivered / total) * 100
  const sorted = latencies.slice().sort((a, b) => a - b)
  if (delivered < total) log(`    ${kleur.yellow(`lost ${total - delivered}/${total} ${label}`)}`)
  assert(deliveryRate >= slo, `Delivery rate ${deliveryRate.toFixed(1)}% below ${slo}% SLO`)
  return [
    { label: 'delivered', value: deliveryRate, unit: '%' },
    { label: 'p50', value: sorted[Math.ceil(sorted.length * 0.5) - 1] ?? 0, unit: 'ms' },
    { label: 'p95', value: sorted[Math.ceil(sorted.length * 0.95) - 1] ?? 0, unit: 'ms' },
    { label: 'p99', value: sorted[Math.ceil(sorted.length * 0.99) - 1] ?? 0, unit: 'ms' },
  ]
}
export async function signInUser(supabase: SupabaseClient, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(`Error signing in: ${error.message}`)
  return data!.session!.access_token
}

export async function executeInsert(supabase: SupabaseClient, table: string): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await supabase
    .from(table)
    .insert([{ value: crypto.randomUUID() }])
    .select('id')

  if (error) throw new Error(`Error inserting data: ${error.message}`)
  return data[0].id
}

export async function executeUpdate(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase
    .from(table)
    .update({ value: crypto.randomUUID() })
    .eq('id', id)

  if (error) throw new Error(`Error updating data: ${error.message}`)
  return data
}

export async function executeDelete(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    throw new Error(`Error deleting data: ${error.message}`)
  }
  return data
}
