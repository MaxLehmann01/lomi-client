import { resolve } from 'path';
import { defineConfig } from 'electron-vite';

export default defineConfig({
    main: {
        resolve: {
            alias: {
                '@main': resolve('src/main'),
                '@preload': resolve('src/preload'),
            },
        },
    },
    preload: {
        resolve: {
            alias: {
                '@preload': resolve('src/preload'),
            },
        },
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
            },
        },
    },
});
