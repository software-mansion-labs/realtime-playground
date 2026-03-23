import { useSupabaseAuthState, type SupabaseAuthState } from '@realtime-playground/realtime-core'
import { authController } from './controllers'

interface SupabaseStore extends SupabaseAuthState {
  init: () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const actions = {
  init: () => authController.init(),
  login: (email: string, password: string) => authController.login(email, password),
  logout: () => authController.logout(),
}

const getSnapshot = (): SupabaseStore => ({
  ...authController.getState(),
  ...actions,
})

type Selector<T> = (state: SupabaseStore) => T

export function useSupabaseStore(): SupabaseStore
export function useSupabaseStore<T>(selector: Selector<T>): T
export function useSupabaseStore<T>(selector?: Selector<T>) {
  const state = useSupabaseAuthState(authController)
  const snapshot = {
    ...state,
    ...actions,
  } as SupabaseStore

  return selector ? selector(snapshot) : snapshot
}

useSupabaseStore.getState = getSnapshot
