import { View } from 'react-native'

import { renderTextChild } from '../utils'
import { tableStyles } from './tableStyles'
import type { TableCellProps } from './Table.types'

export function TableCaption({ children, style, textStyle }: TableCellProps) {
  return (
    <View style={style}>
      {renderTextChild(children, [tableStyles.caption, textStyle])}
    </View>
  )
}
