import { useSyncExternalStore } from 'react'

type Listener = () => void

export type ExternalStore<T> = {
  getState: () => T
  setState: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: Listener) => () => void
}

export const createExternalStore = <T,>(initialState: T): ExternalStore<T> => {
  let state = initialState
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    setState(next) {
      state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const useExternalStoreSnapshot = <T,>(store: ExternalStore<T>) =>
  useSyncExternalStore(store.subscribe, store.getState, store.getState)
