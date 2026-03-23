import { TestsScreenContent } from '../components/testUI'
import { TestSettingsProvider } from '../lib/test-settings'

export default function IndexScreen() {
  return (
    <TestSettingsProvider>
      <TestsScreenContent />
    </TestSettingsProvider>
  )
}
