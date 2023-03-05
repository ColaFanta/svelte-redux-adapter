import { configureStore, createSlice } from '@reduxjs/toolkit'
import { derived, get, writable } from 'svelte/store'
import { afterEach, describe, expect, test } from 'vitest'

import { fromRedux } from '../package/adapter'
import { select } from '../package/utils'

describe('redux store vs svelte store consistency test', () => {
  const writableStore = writable({
    count: 0,
  })

  const svelteCounterStore = {
    subscribe: writableStore.subscribe,
    increment: () => writableStore.update(v => ({ count: v.count + 1 })),
    decrement: () => writableStore.update(v => ({ count: v.count - 1 })),
    reset: () => writableStore.set({ count: 0 }),
  }

  const counterSlice = createSlice({
    name: 'reduxCounterSlice',
    initialState: { count: 0 },
    reducers: {
      increment: state => {
        state.count++
      },
      decrement: state => {
        state.count--
      },
      reset: _ => ({
        count: 0,
      }),
    },
  })

  const reduxCounterStore = configureStore({
    reducer: {
      counter: counterSlice.reducer,
    },
  })

  const adaptedCounterStore = fromRedux(reduxCounterStore)

  afterEach(() => {
    adaptedCounterStore.dispatch(counterSlice.actions.reset())
    svelteCounterStore.reset()
  })

  test('stores should have same result', () => {
    const arr = Array(10).fill(1)
    arr.forEach(() => adaptedCounterStore.dispatch(counterSlice.actions.increment()))
    arr.forEach(() => svelteCounterStore.increment())

    const result1 = get(adaptedCounterStore).counter.count
    const result2 = get(svelteCounterStore).count

    expect(result1).toStrictEqual(10)
    expect(result2).toStrictEqual(10)
  })

  test('`derive` store should has same result with selector', () => {
    const counterVal = derived(adaptedCounterStore, v => v.counter.count)
    const selectCount = select((state: { counter: { count: number } }) => state.counter.count)(adaptedCounterStore)
    Array(10)
      .fill(1)
      .forEach(() => adaptedCounterStore.dispatch(counterSlice.actions.increment()))

    expect(get(counterVal)).toStrictEqual(10)
    expect(get(selectCount)).toStrictEqual(10)
  })

  test('"selector" should memorize it\'s result', () => {
    const selectCount = select((state: { counter: { count: number } }) => state.counter.count)(adaptedCounterStore)
    let newValCount = 0
    selectCount.subscribe(_ => newValCount++)

    adaptedCounterStore.dispatch(counterSlice.actions.increment())
    adaptedCounterStore.dispatch(counterSlice.actions.reset())
    adaptedCounterStore.dispatch(counterSlice.actions.reset())
    adaptedCounterStore.dispatch(counterSlice.actions.reset())

    expect(get(selectCount)).toStrictEqual(0)
    expect(newValCount).toStrictEqual(3)
  })
})
