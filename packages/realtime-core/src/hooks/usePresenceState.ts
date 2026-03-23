import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

/**
 * Example:
 * {
 *   "my-channel": {
 *     "user-123": [{ "key": "value" }]
 *   }
 * }
 */
export type PresenceByChannel = Record<string, Record<string, unknown[]>>

export function usePresenceState() {
  const [presenceState, setPresenceState] = useState<PresenceByChannel>({})

  const addListener = useCallback((channel: RealtimeChannel, channelName: string) => {
    const syncState = () => {
      setPresenceState((prev) => ({
        ...prev,
        [channelName]: channel.presenceState() as Record<string, unknown[]>,
      }))
    }

    channel.on('presence', { event: 'sync' }, syncState)
    channel.on('presence', { event: 'join' }, syncState)
    channel.on('presence', { event: 'leave' }, syncState)
  }, [])

  const clear = useCallback(() => setPresenceState({}), [])

  return { presenceState, addListener, clear }
}
