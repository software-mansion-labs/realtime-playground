import { StyleSheet, Text, View } from 'react-native'
import { useTestSettings } from '../../lib/test-settings'
import { Button, Input, Label, spacing, typography } from '../ui'

export function TestSettingsPanel() {
  const { reset, setSupabaseKey, setSupabaseUrl, supabaseKey, supabaseUrl } = useTestSettings()

  return (
    <View style={styles.formStack}>
      <View style={styles.field}>
        <Label>Supabase URL</Label>
        <Input value={supabaseUrl} onChangeText={setSupabaseUrl} autoCapitalize="none" />
      </View>
      <View style={styles.field}>
        <Label>Supabase Key</Label>
        <Input value={supabaseKey} onChangeText={setSupabaseKey} autoCapitalize="none" />
      </View>
      <View style={styles.inlineRow}>
        <Button variant="outline" onPress={reset}>
          Reset defaults
        </Button>
        <Text style={typography.muted}>All suites use this connection.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  formStack: {
    gap: spacing.md,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
})
