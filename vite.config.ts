import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const hmrEnabled = env.DISABLE_HMR !== 'true';
  const hmrPort = Number(env.VITE_HMR_PORT || 24679);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // File watching stays enabled locally unless the host disables HMR.
      hmr: hmrEnabled ? { port: Number.isFinite(hmrPort) ? hmrPort : 24679 } : false,
    },
    build: {
      target: 'es2019',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('firebase/auth') || id.includes('@firebase/auth')) return 'vendor-firebase-auth';
            if (id.includes('firebase/firestore') || id.includes('@firebase/firestore')) return 'vendor-firebase-firestore';
            if (id.includes('firebase') || id.includes('@firebase')) return 'vendor-firebase-core';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('react-simple-maps') || id.includes('d3-geo')) return 'vendor-maps';
            if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
            return undefined;
          },
        },
      },
    },
  };
});
