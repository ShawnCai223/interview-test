/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'html'], 
      all: true,
      include: ['src/lib/**/*.ts'], 
    },
  },
})