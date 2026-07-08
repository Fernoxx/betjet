import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: { port: 5173 },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      // Keep the content-script bundle self-contained.
      output: { chunkFileNames: 'assets/[name]-[hash].js' },
    },
  },
});
