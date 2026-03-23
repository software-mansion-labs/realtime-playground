import { CollapsibleTrigger, type CollapsibleTriggerProps } from '../Collapsible/CollapsibleTrigger'

export type CardTriggerProps = CollapsibleTriggerProps

export function CardTrigger(props: CardTriggerProps) {
  return <CollapsibleTrigger {...props} />
}
