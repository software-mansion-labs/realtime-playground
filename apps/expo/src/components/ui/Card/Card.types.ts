import type * as React from 'react'
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native'

export type CardRootProps = React.PropsWithChildren<
  ViewProps & {
    collapsible?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
    style?: StyleProp<ViewStyle>
  }
>

export type CardSectionProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export type CardTextSectionProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>
