import * as React from 'react'

import { useControllableState } from '../utils'
import { SelectContext } from './SelectContext'

export type SelectProps = React.PropsWithChildren<{
  defaultOpen?: boolean
  defaultValue?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  value?: string
}>

export function SelectRoot({
  children,
  defaultOpen = false,
  defaultValue,
  onOpenChange,
  onValueChange,
  open,
  value,
}: SelectProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const items = React.useRef(new Map<string, string>())
  const [, forceRender] = React.useState(0)

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    if (items.current.get(itemValue) === label) {
      return
    }

    items.current.set(itemValue, label)
    forceRender((current) => current + 1)
  }, [])

  const valueObject = React.useMemo(
    () => ({
      items: items.current,
      open: !!isOpen,
      registerItem,
      selectedLabel: selectedValue ? items.current.get(selectedValue) : undefined,
      setOpen,
      setValue: (nextValue: string) => {
        setSelectedValue(nextValue)
        setOpen(false)
      },
      value: selectedValue,
    }),
    [isOpen, registerItem, selectedValue, setOpen, setSelectedValue],
  )

  return <SelectContext.Provider value={valueObject}>{children}</SelectContext.Provider>
}
