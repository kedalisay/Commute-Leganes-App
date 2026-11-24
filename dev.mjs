import * as esbuild from 'esbuild'
import { copyFileSync } from 'fs'
import { join, resolve } from 'path'

const repositoryRoot = resolve('.')
const distDirectory = join(repositoryRoot, 'dist')

const appContext = await esbuild.context({
  entryPoints: [join(repositoryRoot, 'src/js/main.js')],
  bundle: true,
  outfile: join(distDirectory, 'output.js'),
  format: 'esm',
  sourcemap: 'inline',
  target: 'es2020',
  logLevel: 'info',
})

const workerContext = await esbuild.context({
  entryPoints: [join(repositoryRoot, 'src/js/route-worker.js')],
  bundle: true,
  outfile: join(distDirectory, 'route-worker.js'),
  format: 'esm',
  sourcemap: 'inline',
  target: 'es2020',
  logLevel: 'info',
})

copyFileSync(
  join(repositoryRoot, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'),
  join(repositoryRoot, 'src/js/maplibre-gl-worker.mjs'),
)
copyFileSync(join(repositoryRoot, 'index.html'), join(distDirectory, 'index.html'))

await Promise.all([appContext.rebuild(), workerContext.rebuild()])
await Promise.all([appContext.watch(), workerContext.watch()])
