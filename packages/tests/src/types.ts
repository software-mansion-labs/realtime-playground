import type { SupabaseClient } from '@supabase/supabase-js'

export type Test = {
  name: string
  body: (
    client: SupabaseClient,
    opts: {
      url: string
      key: string
    },
  ) => Promise<TestData | void>
}

export type TestSuite = {
  [name: string]: Test[]
}

export type TestResult = {
  status: 'passed' | 'failed'
  data?: TestData
}

export type TestData =
  | {
      type: 'normal'
      message: string
    }
  | {
      type: 'load'
      metrics: {
        label: string
        value: number
        unit: string
      }[]
    }
