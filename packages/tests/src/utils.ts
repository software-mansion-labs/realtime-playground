import { createClient } from '@supabase/supabase-js'

import { randomId } from './runtime'
import { Test, TestResult } from './types'

export const runTest = async (test: Test, url: string, key: string): Promise<TestResult> => {
  const client = createClient(url, key, {
    realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
    auth: {
      storageKey: randomId(),
    },
  })

  let result: TestResult
  try {
    const data = (await test.body(client, { url, key })) ?? undefined
    result = {
      status: 'passed',
      data,
    }
  } catch (error) {
    result = {
      status: 'failed',
      data: {
        type: 'normal',
        message: (error as Error)?.message,
      },
    }
  }

  client.realtime.disconnect()

  return result
}
