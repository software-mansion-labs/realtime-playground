import { redirect } from 'next/navigation'
import { toast } from 'sonner'

import { toast as rlCoreToast } from '@realtime-playground/realtime-core'

rlCoreToast.setProvider(toast)

export default function Home() {
  redirect('/playground')
}
