import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                lucas: resolve(__dirname, 'lucas-jacquot/index.html'),
                mariage: resolve(__dirname, 'mariage/index.html'),
                zoltan: resolve(__dirname, 'zoltan-hays/index.html'),
                zoltan_mariage: resolve(__dirname, 'zoltan-hays/mariage/index.html'),
                zoltan_fiction: resolve(__dirname, 'zoltan-hays/fiction/index.html'),
                zoltan_docu: resolve(__dirname, 'zoltan-hays/docu/index.html'),
                zoltan_corporate: resolve(__dirname, 'zoltan-hays/corporate/index.html'),
                zoltan_clips: resolve(__dirname, 'zoltan-hays/clips/index.html'),
                zoltan_reels: resolve(__dirname, 'zoltan-hays/reels/index.html'),
                // Zoltan Dynamic Project Template
                zoltan_project: resolve(__dirname, 'zoltan-hays/project.html'),
            },
        },
    },
});
