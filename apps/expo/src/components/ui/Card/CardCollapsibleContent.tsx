import { CollapsibleContent, type CollapsibleContentProps } from '../Collapsible/CollapsibleContent'
import { cardStyles } from './cardStyles'

export type CardCollapsibleContentProps = CollapsibleContentProps

export function CardCollapsibleContent({ style, ...props }: CardCollapsibleContentProps) {
  return <CollapsibleContent style={[cardStyles.content, style]} {...props} />
}
