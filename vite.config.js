import path from 'path';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: '',
    minify: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
