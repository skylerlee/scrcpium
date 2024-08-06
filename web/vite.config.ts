import type { UserConfig } from 'vite';

export default {
  build: {
    outDir: '../static',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
} satisfies UserConfig;
