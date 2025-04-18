import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
    },
    resolve: {
        alias: {
            'domain': path.resolve(__dirname, './src/domain'),
            'application': path.resolve(__dirname, './src/application'),
            'infrastructure': path.resolve(__dirname, './src/infrastructure'),
        },
    },
});