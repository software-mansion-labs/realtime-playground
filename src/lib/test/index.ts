import broadcastExtension from './broadcast-extension'
import presenceExtension from './presence-extension'
import authorizationCheck from './authorization-check'
import broadcastChanges from './broadcast-changes'
import postgresChangesExtension from './postgres-changes-extension'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

export const testCases: TestSuite = {
  ...broadcastExtension,
  ...presenceExtension,
  ...authorizationCheck,
  ...broadcastChanges,
  ...postgresChangesExtension,
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
