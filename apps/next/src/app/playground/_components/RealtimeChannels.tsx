'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChannelFormValues,
  useClientCreated,
  useRealtimeStore,
} from '@realtime-playground/realtime-core'
import { ChannelCreationForm } from './forms/ChannelCreationForm'

export function RealtimeChannels() {
  const handleCreate = ({ name, config }: ChannelFormValues) => {
    useRealtimeStore.getState().createChannel(name, { config })
  }

  const disabled = !useClientCreated()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channel Creation</CardTitle>
          {disabled && (
            <p className="text-destructive text-xs">
              Please create and connect a client before creating channels.
            </p>
          )}
        </CardHeader>
        <CardContent className={disabled ? 'pointer-events-none opacity-50' : ''}>
          <ChannelCreationForm onSubmit={handleCreate} disabled={disabled} />
        </CardContent>
      </Card>
    </>
  )
}
