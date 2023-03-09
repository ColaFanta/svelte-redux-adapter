import { get } from 'svelte/store'

import type { ReadableWithValue } from './types'

/** select a state from readable store  */
export function select<Result, State = unknown>(
  sel: (state: State) => Result
): (store: ReadableWithValue<State>) => ReadableWithValue<Result> {
  let memoized: Result | undefined
  return (store: ReadableWithValue<State>) => ({
    subscribe: (listener: (t: Result) => void) => {
      listener((memoized = sel(store.value)))
      return store.subscribe(s => {
        const incoming = sel(s)
        if (incoming !== memoized) listener((memoized = incoming))
      })
    },
    get value() {
      return memoized ?? get(this)
    },
  })
}
