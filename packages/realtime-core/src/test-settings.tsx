import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { createTestSettingsDefaults } from './schemas'
import type { RealtimeEnvDefaults, TestSettings } from './types'

export type TestSettingsConfig = Pick<RealtimeEnvDefaults, 'supabaseKey' | 'supabaseUrl'>

export type TestSettingsContextValue = TestSettings & {
  setSupabaseUrl: (url: string) => void
  setSupabaseKey: (key: string) => void
}

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null)

export function TestSettingsProvider({
  children,
  config,
}: {
  children: ReactNode
  config?: TestSettingsConfig
}) {
  const defaults = useMemo(() => createTestSettingsDefaults(config), [config])

  const [supabaseUrl, setSupabaseUrl] = useState(defaults.supabaseUrl)
  const [supabaseKey, setSupabaseKey] = useState(defaults.supabaseKey)

  const value = useMemo<TestSettingsContextValue>(
    () => ({
      supabaseUrl,
      supabaseKey,
      setSupabaseUrl,
      setSupabaseKey,
    }),
    [supabaseKey, supabaseUrl],
  )

  return <TestSettingsContext.Provider value={value}>{children}</TestSettingsContext.Provider>
}

export function useTestSettings() {
  const context = useContext(TestSettingsContext)

  if (!context) {
    throw new Error('useTestSettings must be used within a TestSettingsProvider')
  }

  return context
}
