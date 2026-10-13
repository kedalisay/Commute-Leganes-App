import * as esbuild from 'esbuild';
import {copyFileSync} from 'fs';

await esbuild.build({
    entryPoints: ['src/js/main.js'],
    bundle: true,
    outfile: 'dist/output.js',
    format: 'esm'
});

copyFileSync(
    'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
    'src/js/maplibre-gl-worker.mjs'
);