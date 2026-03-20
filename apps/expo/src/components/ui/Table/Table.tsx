import { ScrollView, View, type ScrollViewProps } from 'react-native'

import { tableStyles } from './tableStyles'

export function TableRoot({ children, style, ...props }: ScrollViewProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style} {...props}>
      <View style={tableStyles.table}>{children}</View>
    </ScrollView>
  )
}
