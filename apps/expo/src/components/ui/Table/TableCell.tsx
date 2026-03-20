import { View } from 'react-native'

import { renderTextChild } from '../utils'
import { tableStyles } from './tableStyles'
import type { TableCellProps } from './Table.types'

export function TableCell({ children, flex = 1, style, textStyle }: TableCellProps) {
  return (
    <View style={[tableStyles.cell, { flex }, style]}>
      {renderTextChild(children, [tableStyles.cellText, textStyle])}
    </View>
  )
}
