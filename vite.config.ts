import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@navigation': path.resolve(__dirname, './src/navigation'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@router': path.resolve(__dirname, './src/router'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@atoms': path.resolve(__dirname, './src/ui/atoms'),
      '@molecules': path.resolve(__dirname, './src/ui/molecules'),
      '@organisms': path.resolve(__dirname, './src/ui/organisms'),
      '@templates': path.resolve(__dirname, './src/ui/templates'),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
  },
} as UserConfig);
