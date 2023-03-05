<script lang="ts">
  import type { EnhancedStore } from '@reduxjs/toolkit'
  import { setContext } from 'svelte'

  import { fromRedux } from './adapter'
  import { contextKey_adapted, contextKey_original } from './hooks'

  export let store: EnhancedStore
  setContext(contextKey_original, store)
  setContext(contextKey_adapted, fromRedux(store))
</script>

<slot />
