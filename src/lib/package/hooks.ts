import type { Action, AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { getContext } from 'svelte'

import type { ReadableWithValue } from './types'
import { select } from './utils'

export const contextKey_original = Symbol('redux-original-store')
export const contextKey_adapted = Symbol('redux-adapted-store')

/** select a state from store in nearest `Provider` */
export function useSelector<T, RootState = unknown>(sel: (state: RootState) => T) {
  return select(sel)(useStore<RootState>())
}

/** get the store from nearest `Provider` */
export function useStore<RootState = unknown, A extends Action<any> = AnyAction>() {
  return getContext(contextKey_adapted) as ReadableWithValue<RootState> & { dispatch: ThunkDispatch<RootState, any, A> }
}

/** get the dispatch method from nearest `Provider` */
export function useDispatch<RootState = unknown, A extends Action<any> = AnyAction>() {
  return useStore<RootState, A>().dispatch
}
