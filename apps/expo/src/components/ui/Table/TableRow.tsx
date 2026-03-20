import { View } from 'react-native'

import { tableStyles } from './tableStyles'
import type { TableSectionProps } from './Table.types'

export function TableRow({ style, ...props }: TableSectionProps) {
  return <View style={[tableStyles.row, style]} {...props} />
}
