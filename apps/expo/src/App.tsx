import { ExpoRoot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const metroRequire = require as NodeJS.Require & {
  context: (
    path: string,
    recursive?: boolean,
    filter?: RegExp,
    mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once',
  ) => any
}

const context = metroRequire.context('./app')

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpoRoot context={context} />
    </SafeAreaProvider>
  )
}
