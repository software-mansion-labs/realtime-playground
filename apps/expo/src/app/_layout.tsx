import { Stack } from 'expo-router'
import * as React from 'react'

import { Toaster } from '../components/ui'
import { colors } from '../components/ui/theme'

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: {
            color: colors.foreground,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: '' }} />
        <Stack.Screen name="playground" options={{ title: 'Playground' }} />
        <Stack.Screen name="ui-list" options={{ title: 'UI List' }} />
      </Stack>
      <Toaster />
    </>
  )
}
