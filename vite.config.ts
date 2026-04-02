import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    lib: {
      entry: './src/index.ts',
      name: 'GeoStyler',
      formats: ['iife'],
      fileName: 'geostyler',
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        globals: {
          'emitter': 'require$$0',
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  define: {
    appName: 'GeoStyler'
  },
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    mainFields: ['module', 'main', 'jsnext:main', 'jsnext']
  }
});
