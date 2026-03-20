import { FormRoot } from './Form'
import { FormControl } from './FormControl'
import { FormDescription } from './FormDescription'
import { FormField } from './FormField'
import { FormItem } from './FormItem'
import { FormLabel } from './FormLabel'
import { FormMessage } from './FormMessage'
import { useFormField } from './useFormField'

export const Form = Object.assign(FormRoot, {
  Root: FormRoot,
  Field: FormField,
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Description: FormDescription,
  Message: FormMessage,
  useField: useFormField,
})
