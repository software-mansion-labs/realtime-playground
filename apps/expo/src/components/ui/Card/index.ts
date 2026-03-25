import { CardRoot } from './Card'
import { CardAction } from './CardAction'
import { CardCollapsibleContent } from './CardCollapsibleContent'
import { CardContent } from './CardContent'
import { CardDescription } from './CardDescription'
import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardTitle } from './CardTitle'
import { CardTrigger } from './CardTrigger'

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Trigger: CardTrigger,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  CollapsibleContent: CardCollapsibleContent,
  Footer: CardFooter,
})
