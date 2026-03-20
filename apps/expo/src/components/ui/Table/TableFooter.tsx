import { View } from 'react-native'

import { tableStyles } from './tableStyles'
import type { TableSectionProps } from './Table.types'

export function TableFooter({ style, ...props }: TableSectionProps) {
  return <View style={[tableStyles.footer, style]} {...props} />
}
