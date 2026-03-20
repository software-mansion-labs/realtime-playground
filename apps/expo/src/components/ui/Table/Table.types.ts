import type * as React from 'react'
import type {
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native'

export type TableSectionProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export type TableCellProps = React.PropsWithChildren<{
  flex?: number
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}>
