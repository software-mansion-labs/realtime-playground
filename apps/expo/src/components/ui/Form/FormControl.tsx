import * as React from 'react'

import { useFormField } from './useFormField'

type FormControlProps = {
  children: React.ReactNode
}

export function FormControl({ children }: FormControlProps) {
  const { error, formDescriptionId, formItemId, formLabelId, formMessageId } = useFormField()

  if (!React.isValidElement(children)) {
    return children
  }

  const childElement = children as React.ReactElement<any>

  return React.cloneElement(childElement, {
    nativeID: formItemId,
    accessibilityHint: error ? `${formDescriptionId}. ${formMessageId}` : formDescriptionId,
    accessibilityState: { invalid: !!error },
    accessibilityLabelledBy: formLabelId,
  })
}
