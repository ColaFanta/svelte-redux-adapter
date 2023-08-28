import { sveltekit } from '@sveltejs/kit/vite'
import { type UserConfigExport, defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
