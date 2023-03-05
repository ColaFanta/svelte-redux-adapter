/* eslint-disable @typescript-eslint/ban-types */
import type { Action, AnyAction, EnhancedStore, Middleware, StoreEnhancer, ThunkDispatch } from '@reduxjs/toolkit'
import type { Readable } from 'svelte/store'

/** Creates a readable store that satisfies `Svelte's Store Contract` from a Redux store
 * @link https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract
 */
export function fromRedux<
  S = any,
  A extends Action<any> = AnyAction,
  M extends ReadonlyArray<Middleware<{}, S>> = ReadonlyArray<Middleware<{}, S>>,
  E extends ReadonlyArray<StoreEnhancer> = ReadonlyArray<StoreEnhancer>
>(reduxStore: EnhancedStore<S, A, M, E>): Readable<S> & { dispatch: ThunkDispatch<S, any, A> } {
  return {
    subscribe: (listener: (v: S) => void) => {
      listener(reduxStore.getState())
      return reduxStore.subscribe(() => listener(reduxStore.getState()))
    },
    dispatch: reduxStore.dispatch,
  }
}
