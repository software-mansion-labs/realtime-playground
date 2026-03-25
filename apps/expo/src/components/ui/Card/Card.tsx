import { View } from 'react-native'

import { CollapsibleRoot } from '../Collapsible/Collapsible'
import type { CardRootProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardRoot({
  children,
  collapsible = false,
  defaultOpen,
  onOpenChange,
  open,
  style,
  ...props
}: CardRootProps) {
  const content = (
    <View style={[cardStyles.card, style]} {...props}>
      {children}
    </View>
  )

  if (
    !collapsible &&
    defaultOpen === undefined &&
    onOpenChange === undefined &&
    open === undefined
  ) {
    return content
  }

  return (
    <CollapsibleRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      {content}
    </CollapsibleRoot>
  )
}
