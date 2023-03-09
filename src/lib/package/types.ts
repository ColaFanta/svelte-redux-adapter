import type { Readable } from 'svelte/store'

export type ReadableWithValue<T> = Readable<T> & {
  readonly value: T
}
