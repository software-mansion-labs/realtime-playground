import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { colors } from '../theme'

export type DialogOverlayProps = PressableProps & {
  style?: StyleProp<ViewStyle>
}

export function DialogOverlay({ style, ...props }: DialogOverlayProps) {
  return <Pressable style={[styles.overlay, style]} {...props} />
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 1,
  },
})
