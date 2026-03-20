import * as React from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { colors, radii } from './theme'

type SkeletonProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ style, ...props }: SkeletonProps) {
  const opacity = React.useRef(new Animated.Value(0.45)).current

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.45,
          useNativeDriver: true,
        }),
      ]),
    )

    animation.start()

    return () => {
      animation.stop()
    }
  }, [opacity])

  return <Animated.View style={[styles.base, { opacity }, style]} {...props} />
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
  },
})
