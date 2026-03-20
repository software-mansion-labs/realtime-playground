import { Modal, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { dismiss, useToasts } from './sonnerStore'
import { sonnerStyles } from './sonnerStyles'
import { SonnerToast } from './SonnerToast'

export type ToasterProps = {
  style?: StyleProp<ViewStyle>
}

export function Toaster({ style }: ToasterProps) {
  const toasts = useToasts()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  if (toasts.length === 0) {
    return null
  }

  return (
    <Modal animationType="none" onRequestClose={() => dismiss()} transparent visible>
      <View
        pointerEvents="box-none"
        style={[sonnerStyles.root, { paddingBottom: Math.max(insets.bottom, 16) }, style]}
      >
        {toasts.map((record) => (
          <SonnerToast key={record.id} record={record} wide={width > 480} />
        ))}
      </View>
    </Modal>
  )
}
