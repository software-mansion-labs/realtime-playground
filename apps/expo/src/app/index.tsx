import { TestSettingsProvider } from '@realtime-playground/realtime-core'
import { TestsScreenContent } from '../components/testUI'
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '../lib/constants'

export default function IndexScreen() {
  return (
    <TestSettingsProvider
      config={{
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_KEY,
      }}
    >
      <TestsScreenContent />
    </TestSettingsProvider>
  )
}
