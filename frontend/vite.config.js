import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
    host: true,
    strictPort: false,
  },
  // Add these configurations for environment variables
  define: {
    'process.env': {},
    // Optional: If you need to expose specific env variables
    __APP_ENV__: JSON.stringify(process.env.npm_config_env || 'development'),
  },
  // Environment variable handling
  envPrefix: 'VITE_', // Only variables prefixed with VITE_ will be exposed
});