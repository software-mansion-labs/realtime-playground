import { createClient, SupabaseClient } from '@supabase/supabase-js'

export { testCases } from './test_suites'

export type Test = {
  name: string
  body: (client: SupabaseClient) => Promise<void>
}

export type TestSuite = {
  [name: string]: Test[]
}

export type TestResult =
  | {
      status: 'passed'
    }
  | {
      status: 'failed'
      message: string
    }

export const runTest = async (test: Test, url: string, key: string): Promise<TestResult> => {
  const client = createClient(url, key, { realtime: { heartbeatIntervalMs: 5000, timeout: 5000 } })
  let result: TestResult
  try {
    await test.body(client)
    result = {
      status: 'passed',
    }
  } catch (e) {
    result = {
      status: 'failed',
      message: (e as Error).message,
    }
  }
  client.realtime.disconnect()

  return result
}
