import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createTestSettingsDefaults } from '@realtime-playground/realtime-core'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '@/lib/constants'

interface TestSettings {
  supabaseUrl: string
  supabaseKey: string
}

interface TestSettingsContextValue extends TestSettings {
  setSupabaseUrl: (url: string) => void
  setSupabaseKey: (key: string) => void
}

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null)

export function TestSettingsProvider({ children }: { children: ReactNode }) {
  const defaults = createTestSettingsDefaults({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
  })
  const [supabaseUrl, setSupabaseUrl] = useState(defaults.supabaseUrl)
  const [supabaseKey, setSupabaseKey] = useState(defaults.supabaseKey)

  const value: TestSettingsContextValue = {
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey,
    setSupabaseUrl: useCallback((url: string) => setSupabaseUrl(url), []),
    setSupabaseKey: useCallback((key: string) => setSupabaseKey(key), []),
  }

  return <TestSettingsContext.Provider value={value}>{children}</TestSettingsContext.Provider>
}

export function useTestSettings(): TestSettingsContextValue {
  const context = useContext(TestSettingsContext)
  if (!context) {
    throw new Error('useTestSettings must be used within a TestSettingsContext.Provider')
  }
  return context
}
