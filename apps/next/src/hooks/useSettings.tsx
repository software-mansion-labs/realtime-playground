'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '@/lib/constants'

interface Settings {
  supabaseUrl: string
  supabaseKey: string
}

interface SettingsContextValue extends Settings {
  setSupabaseUrl: (url: string) => void
  setSupabaseKey: (key: string) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [supabaseUrl, setSupabaseUrl] = useState(PUBLIC_SUPABASE_URL)
  const [supabaseKey, setSupabaseKey] = useState(PUBLIC_SUPABASE_KEY)

  const value: SettingsContextValue = {
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseKey,
    setSupabaseUrl: useCallback((url: string) => setSupabaseUrl(url), []),
    setSupabaseKey: useCallback((key: string) => setSupabaseKey(key), []),
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsContext.Provider')
  }
  return context
}
