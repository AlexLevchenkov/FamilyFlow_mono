import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === 'development';

  return {
    base: process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, './src/shared/api'),
        '@assets': path.resolve(__dirname, './src/shared/assets'),
        '@features': path.resolve(__dirname, './src/features'),
        '@hooks': path.resolve(__dirname, './src/features/auth/hooks'),
        '@layouts': path.resolve(__dirname, './src/shared/layouts'),
        '@lib': path.resolve(__dirname, './src/shared/lib'),
        '@types': path.resolve(__dirname, './src/shared/types'),
        '@mocks': path.resolve(__dirname, './src/shared/mocks'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@schemas': path.resolve(__dirname, './src/features/auth/schemas'),
        '@store': path.resolve(__dirname, './src/features/auth/store'),
        '@styles': path.resolve(__dirname, './src/shared/styles'),
        '@ui': path.resolve(__dirname, './src/shared/ui'),
        '@atoms': path.resolve(__dirname, './src/shared/ui/atoms'),
        '@molecules': path.resolve(__dirname, './src/shared/ui/molecules'),
        '@organisms': path.resolve(__dirname, './src/shared/ui/organisms'),
        '@templates': path.resolve(__dirname, './src/shared/ui/templates'),
      },
    },
    server: {
      host: process.env.DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '5173'),
      strictPort: true,
    },
    preview: {
      host: process.env.DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      globals: true,
      css: true,
    },
  } as UserConfig;
});
