import { SelectContent } from './SelectContent'
import { SelectGroup } from './SelectGroup'
import { SelectItem } from './SelectItem'
import { SelectLabel } from './SelectLabel'
import { SelectRoot } from './Select'
import { SelectScrollDownButton } from './SelectScrollDownButton'
import { SelectScrollUpButton } from './SelectScrollUpButton'
import { SelectSeparator } from './SelectSeparator'
import { SelectTrigger } from './SelectTrigger'
import { SelectValue } from './SelectValue'

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
})
