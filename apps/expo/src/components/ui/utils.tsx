import * as React from 'react'
import {
  Pressable,
  type PressableStateCallbackType,
  Text,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

type ControllableStateProps<T> = {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (nextValue: T | ((previousValue: T) => T)) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previousValue: T | undefined) => T)(currentValue)
          : nextValue

      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      onChange?.(resolvedValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue] as const
}

export function composeEventHandlers<E>(
  originalHandler?: ((event: E) => void) | null,
  nextHandler?: ((event: E) => void) | null,
) {
  return (event: E) => {
    originalHandler?.(event)
    nextHandler?.(event)
  }
}

export function renderTextChild(
  children: React.ReactNode,
  textStyle?: StyleProp<TextStyle>,
  numberOfLines?: number,
) {
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Text numberOfLines={numberOfLines} style={textStyle}>
        {children}
      </Text>
    )
  }

  return children
}

type SlottablePressableProps = PressableProps & {
  asChild?: boolean
  children: React.ReactNode
  style?: PressableProps['style']
}

export function SlottablePressable({
  asChild = false,
  children,
  onPress,
  style,
  ...props
}: SlottablePressableProps) {
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<PressableProps>
    const childProps = childElement.props as PressableProps & {
      style?: PressableProps['style']
    }

    return React.cloneElement(childElement, {
      ...props,
      ...childProps,
      onPress: composeEventHandlers(childProps.onPress, onPress),
      style: mergePressableStyles(style, childProps.style),
    })
  }

  return (
    <Pressable onPress={onPress} style={style} {...props}>
      {children}
    </Pressable>
  )
}

export function withPressableState(
  baseStyle: StyleProp<any>,
  pressedStyle?: StyleProp<any>,
  disabledStyle?: StyleProp<any>,
  disabled?: boolean,
) {
  return ({ pressed }: PressableStateCallbackType) => [
    baseStyle,
    pressed && pressedStyle,
    disabled && disabledStyle,
  ]
}

function resolvePressableStyle(
  style: PressableProps['style'],
  state: PressableStateCallbackType,
): StyleProp<ViewStyle> {
  return typeof style === 'function' ? style(state) : style
}

function mergePressableStyles(
  left?: PressableProps['style'],
  right?: PressableProps['style'],
): PressableProps['style'] {
  if (!left) {
    return right
  }

  if (!right) {
    return left
  }

  return (state) => [resolvePressableStyle(left, state), resolvePressableStyle(right, state)]
}

export function stopEvent<T extends GestureResponderEvent>(event: T) {
  event.stopPropagation()
}
