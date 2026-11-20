import * as esbuild from 'esbuild';
import {copyFileSync} from 'fs';

esbuild.build({
        entryPoints: ['src/js/main.js'],
        bundle: true,
        outfile: 'dist/output.js',
        format: 'esm'
    }).then(() => esbuild.build({
        entryPoints: ['src/js/route-worker.js'],
        bundle: true,
        outfile: 'dist/route-worker.js',
        format: 'esm',
    })).then(() => {
        copyFileSync(
            'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
            'src/js/maplibre-gl-worker.mjs'
        );
    }).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });