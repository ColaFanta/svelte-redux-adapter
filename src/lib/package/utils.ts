import { type Readable, get } from 'svelte/store'

/** select a state from readable store  */
export function select<T, State = unknown>(sel: (state: State) => T) {
  let memoized: T | undefined
  return (store: Readable<State>) => ({
    subscribe: (listener: (t: T) => void) => {
      listener((memoized = sel(get(store))))
      return store.subscribe(s => {
        const incoming = sel(s)
        if (incoming !== memoized) listener((memoized = incoming))
      })
    },
  })
}
