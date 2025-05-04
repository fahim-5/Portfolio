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
    port: 5173,        // Changed from 3000 to Vite's default 5173
    open: false,       // Don't open browser automatically
    host: true,        // Expose to all network interfaces 
    strictPort: false, // Allow fallback to another port if this one is in use
  },
}); 