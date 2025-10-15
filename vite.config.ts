import { defineConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: defineVitestConfig({
    globals: true,
    environment: 'jsdom',
  }).test,
});