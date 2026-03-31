import { defineConfig, UserConfig} from 'vite'
import react from '@vitejs/plugin-react';
import path from 'node:path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, '../common'),
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@router': path.resolve(__dirname, './src/router'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@atoms': path.resolve(__dirname, './src/ui/atoms'),
      '@molecules': path.resolve(__dirname, './src/ui/molecules'),
      '@organisms': path.resolve(__dirname, './src/ui/organisms'),
      '@templates': path.resolve(__dirname, './src/ui/templates'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
  },
} as UserConfig);
