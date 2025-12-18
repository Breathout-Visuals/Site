import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                portfolio: resolve(__dirname, 'lucas-jacquot/index.html'),
                mariage: resolve(__dirname, 'mariage/index.html'),
            },
        },
    },
});
