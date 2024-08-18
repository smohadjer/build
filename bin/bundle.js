import * as esbuild from 'esbuild';
import * as fs from 'fs';

const args = process.argv.slice(2);

/* bundling js files */
const jsEntryPoints = fs.readdirSync('app/resources/js').filter(name => name !== '.DS_Store' && name !== 'modules').map(item => 'app/resources/js/' + item);
console.log('js entryPoints', jsEntryPoints);
const ctxjs = await esbuild.context({
  entryPoints: jsEntryPoints,
  bundle: true,
  target: [
    'chrome58',
    'edge16',
    'firefox57',
    'safari11',
  ],
  outdir: 'public/resources/js',
});

if (args[0] === 'watch') {
  await ctxjs.watch();
  console.log('watching js...');
} else {
  await ctxjs.rebuild();
  ctxjs.dispose();
  console.log('disposed context');
}

/* bundling css files */
const cssEntryPoints = fs.readdirSync('app/resources/css').filter(name => name !== '.DS_Store' && name !== 'modules').map(item => 'app/resources/css/' + item);
console.log('css entryPoints', cssEntryPoints);
const ctxcss = await esbuild.context({
  entryPoints: cssEntryPoints,
  bundle: true,
  loader: {
    '.svg': 'dataurl',
    '.ttf': 'copy',
    '.otf': 'copy'
  },
  target: [
    'chrome58',
    'edge16',
    'firefox57',
    'safari11',
  ],
  outdir: 'public/resources/css',
});

if (args[0] === 'watch') {
  await ctxcss.watch();
  console.log('watching css...');
} else {
  await ctxcss.rebuild();
  ctxcss.dispose();
  console.log('disposed context');
}
