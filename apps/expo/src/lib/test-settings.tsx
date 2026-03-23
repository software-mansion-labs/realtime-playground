import { createTestSettingsDefaults, type TestSettings } from '@realtime-playground/realtime-core'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from './constants'

type TestSettingsContextValue = TestSettings & {
  setSupabaseUrl: (url: string) => void
  setSupabaseKey: (key: string) => void
  reset: () => void
}

const defaults = createTestSettingsDefaults({
  supabaseUrl: PUBLIC_SUPABASE_URL,
  supabaseKey: PUBLIC_SUPABASE_KEY,
})

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null)

export function TestSettingsProvider({ children }: { children: ReactNode }) {
  const [supabaseUrl, setSupabaseUrl] = useState(defaults.supabaseUrl)
  const [supabaseKey, setSupabaseKey] = useState(defaults.supabaseKey)

  const reset = useCallback(() => {
    setSupabaseUrl(defaults.supabaseUrl)
    setSupabaseKey(defaults.supabaseKey)
  }, [])

  const value = useMemo<TestSettingsContextValue>(
    () => ({
      supabaseUrl,
      supabaseKey,
      setSupabaseUrl,
      setSupabaseKey,
      reset,
    }),
    [reset, supabaseKey, supabaseUrl],
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
