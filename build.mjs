import * as esbuild from 'esbuild';
import {copyFileSync} from 'fs';

await esbuild.build({
    entryPoints: ['js/main.js'],
    bundle: true,
    outfile: 'js/output.js',
    format: 'esm'
});

copyFileSync(
    'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
    'js/maplibre-gl-worker.mjs'
);