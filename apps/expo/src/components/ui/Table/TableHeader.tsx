import { View } from 'react-native'

import { tableStyles } from './tableStyles'
import type { TableSectionProps } from './Table.types'

export function TableHeader({ style, ...props }: TableSectionProps) {
  return <View style={[tableStyles.header, style]} {...props} />
}
