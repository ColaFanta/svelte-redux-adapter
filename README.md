# Svelte Redux Adapter

A simple wrapper on `Redux` and makes it possible to use `Redux` store on svelte. 

Under the hook, it adapts `Redux` store's `subscribe` method to svelte's [store contract](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract), without any extra `Readable`, `Derived` overhead.

[![npm version](https://badge.fury.io/js/svelte-redux-adapter.svg)](https://badge.fury.io/js/svelte-redux-adapter.svg)

[Demo Counter App](https://stackblitz.com/github/ColaFanta/svelte-redux-adapter?file=src/routes/Counter.svelte)


## Install

Install svelte-redux-adapter package

```bash
npm install svelte-redux-store
```

Install redux package

```bash
npm install @reduxjs/toolkit
```

# API

- [Provider](##`Provider`)
- [useSelector](##`useSelector()`)
- [useStore, useDispatch](##`useStore()`,`useDispatch()`)
- [store.value](##`store.value`)


## `Provider`
A svelte component that injects store instance to context.

### Example
  - Define store
    ```js
        // src/counter-store.ts
    import {configureStore, createSlice} from '@reduxjs/toolkit'
    const counter = createSlice({
      name: 'counter',
      initialState: {
        count: 0
      },
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
    const reduxStore = configureStore({
      reducer: {
        counter: counter.reducer,
      },
    }) 
    ```
  - provide store to context
    ```html
      <script lang="ts">
      import Provider from '$lib/Provider.svelte'
      import { reduxStore } from './counter-store'
      </script>

      <div class="app">
        <main>
          <Provider store={reduxStore}>
            <slot />
          </Provider>
        </main>
      </div>
    ```

## `useSelector()`
Creates a store similar to `Derived` from part of your store using selector function. The result of selector is memoized and compared by `===`

## `useStore()`, `useDispatch()`
Hooks to grab `store`, `dispatch` from nearest `Provider`

### Example
  ```jsx
  <script lang="ts">
    import { spring } from 'svelte/motion'
    import { useSelector, useStore } from 'svelte-redux-adapter'
    import { type RootState, actions } from './counter-store'

    const store = useStore<RootState>()

    /** Derive your state using either selector */
    const count = useSelector((rootState: RootState) => rootState.counter.count)
    /** Or using reactive statement */
    $: count3x = $store.counter.count * 3

    const displayed_count = spring()
    $: displayed_count.set($count)
    $: offset = modulo($displayed_count, 1)

    const displayed_count_3x = spring()
    $: displayed_count_3x.set(count3x)
    $: offset_3x = modulo($displayed_count_3x, 1)

    function modulo(n: number, m: number) {
      // handle negative numbers
      return ((n % m) + m) % m
    }
  </script>

  <div class="counter">
    <button
      on:click={() => store.dispatch(actions.decrement())}
      aria-label="Decrease the counter by one"
      data-testid="decrement_btn">
      <svg aria-hidden="true" viewBox="0 0 1 1">
        <path d="M0,0.5 L1,0.5" />
      </svg>
    </button>

    <div class="counter-viewport">
      <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
        <strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
        <strong data-testid="display_count">{Math.floor($displayed_count)}</strong>
      </div>
    </div>

    <div class="counter-viewport">
      <div class="counter-digits" style="transform: translate(0, {100 * offset_3x}%)">
        <strong class="hidden" aria-hidden="true">{Math.floor($displayed_count_3x + 1)}</strong>
        <strong data-testid="display_count_3x">{Math.floor($displayed_count_3x)}</strong>
      </div>
    </div>

    <button
      on:click={() => store.dispatch(actions.increment())}
      aria-label="Increase the counter by one"
      data-testid="increment_btn">
      <svg aria-hidden="true" viewBox="0 0 1 1">
        <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
      </svg>
    </button>
  </div>

  ```

## `store.value`
Those adapted `stores`, either from `redux` or `useSelector`, have an extra getter `.value`. It helps you get memoized value from store instantly which is faster and cleaner than using built-in `store/get`.

  ```js
  const count = useSelector((rootState: RootState) => rootState.counter.count)

  console.log(count.value === get(count)) // print: true
  ```

## Contributing ✨

Interested in contributing to this repo? Check out our and submit a PR for a new feature/bug fix.

A big shoutout to all our contributors! You could be here too! ✨

<a href="https://github.com/ColaFanta/svelte-redux-adapter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ColaFanta/svelte-redux-adapter" />
</a>

## Inspire by

[svelte-redux-store](https://github.com/vanzinvestor/svelte-redux-store)
