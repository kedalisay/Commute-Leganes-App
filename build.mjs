import * as esbuild from 'esbuild';
import { copyFileSync } from 'fs';
import { join, resolve } from 'path'

const repositoryRoot = resolve('.')
const distDirectory = join(repositoryRoot, 'dist')

esbuild.build({
  entryPoints: [join(repositoryRoot, 'src/js/main.js')],
  bundle: true,
  minify: true,
  outfile: join(distDirectory, 'output.js'),
  format: 'esm'
}).then(() => esbuild.build({
  entryPoints: [join(repositoryRoot, 'src/js/route-worker.js')],
  bundle: true,
  minify: true,
  outfile: join(distDirectory, 'route-worker.js'),
  format: 'esm',
})).then(() => {
  copyFileSync(
      join(repositoryRoot, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'),
      join(repositoryRoot, 'src/js/maplibre-gl-worker.mjs')
  );
  copyFileSync(join(repositoryRoot, 'index.html'), join(distDirectory, 'index.html'))
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});