import { View } from 'react-native'

import { tableStyles } from './tableStyles'
import type { TableSectionProps } from './Table.types'

export function TableBody({ style, ...props }: TableSectionProps) {
  return <View style={[tableStyles.body, style]} {...props} />
}
