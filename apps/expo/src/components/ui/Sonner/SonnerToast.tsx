import { Pressable, Text, View } from 'react-native'

import { colors } from '../theme'
import { sonnerStyles } from './sonnerStyles'
import { dismiss } from './sonnerStore'
import type { ToastRecord, ToastType } from './sonnerTypes'

type SonnerToastProps = {
  record: ToastRecord
  wide?: boolean
}

function iconForType(type: ToastType) {
  switch (type) {
    case 'success':
      return 'OK'
    case 'info':
      return 'i'
    case 'warning':
      return '!'
    case 'error':
      return 'x'
    case 'loading':
      return '...'
  }
}

function colorForType(type: ToastType) {
  switch (type) {
    case 'success':
      return colors.success
    case 'info':
      return colors.info
    case 'warning':
      return colors.warning
    case 'error':
      return colors.error
    case 'loading':
      return colors.mutedForeground
  }
}

export function SonnerToast({ record, wide = false }: SonnerToastProps) {
  const hasDescription = !!record.description

  return (
    <View
      style={[
        sonnerStyles.toast,
        wide ? sonnerStyles.toastWide : null,
        !hasDescription ? sonnerStyles.toastCentered : null,
      ]}
    >
      <View
        style={[
          sonnerStyles.iconContainer,
          !hasDescription ? sonnerStyles.iconContainerCentered : null,
          { backgroundColor: colorForType(record.type) },
        ]}
      >
        <Text style={sonnerStyles.icon}>{iconForType(record.type)}</Text>
      </View>
      <View style={[sonnerStyles.copy, !hasDescription ? sonnerStyles.copyCentered : null]}>
        <Text style={sonnerStyles.title}>{record.title}</Text>
        {record.description ? (
          <Text style={sonnerStyles.description}>{record.description}</Text>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" onPress={() => dismiss(record.id)} style={sonnerStyles.close}>
        <Text style={sonnerStyles.closeText}>x</Text>
      </Pressable>
    </View>
  )
}
