import { View } from 'react-native'

import { renderTextChild } from '../utils'
import { tableStyles } from './tableStyles'
import type { TableCellProps } from './Table.types'

export function TableHead({ children, flex = 1, style, textStyle }: TableCellProps) {
  return (
    <View style={[tableStyles.cell, { flex }, style]}>
      {renderTextChild(children, [tableStyles.headText, textStyle])}
    </View>
  )
}
