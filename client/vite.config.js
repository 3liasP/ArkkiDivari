import { dependencies } from './package.json';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

function renderChunks(deps) {
    const chunks = {};
    Object.keys(deps).forEach((key) => {
        if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
        chunks[key] = [key];
    });
    return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-router-dom', 'react-dom'], // Separate commonly used dependencies
                    ...renderChunks(dependencies), // Chunk other dependencies
                },
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8010',
                changeOrigin: true,
            },
        },
        port: 8011,
    },
});
