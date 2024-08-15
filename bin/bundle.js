import * as esbuild from 'esbuild';
import * as fs from 'fs';

const args = process.argv.slice(2);

const entryPoints = fs.readdirSync('app/resources/js').filter(name => name !== '.DS_Store' && name !== 'modules').map(item => 'app/resources/js/' + item);
console.log('entryPoints', entryPoints);
let ctxjs = await esbuild.context({
  entryPoints: entryPoints,
  bundle: true,
  target: [
    'chrome58',
    'edge16',
    'firefox57',
    'safari11',
  ],
  outdir: 'public/resources/js',
});

const jsApiFiles = fs.readdirSync('api/ts').filter(name => name !== '.DS_Store').map(item => 'api/ts/'+item);
const ctxJSRootFiles = await esbuild.context({
  entryPoints: jsApiFiles,
  bundle: false,
  platform: 'node',
  outdir: 'api',
});

if (args[0] === 'watch') {
  await ctxjs.watch();
  await ctxJSRootFiles.watch();
  console.log('watching js...');
} else {
  await ctxjs.rebuild();
  await ctxJSRootFiles.rebuild();
  ctxjs.dispose();
  ctxJSRootFiles.dispose();
  console.log('disposed context');
}

let ctxcss = await esbuild.context({
  entryPoints: ['app/resources/css/styles.css'],
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
  outfile: 'public/resources/css/styles.css',
});

const cssRootFiles = fs.readdirSync('app/resources/css').filter(name => name !== '.DS_Store' && name !== 'modules' && name !== 'styles.css').map(item => 'app/resources/css/'+item);
const ctxCSSRootFiles = await esbuild.context({
  entryPoints: cssRootFiles,
  outdir: 'public/resources/css',
});

if (args[0] === 'watch') {
  await ctxcss.watch();
  await ctxCSSRootFiles.watch();
  console.log('watching css...');
} else {
  await ctxcss.rebuild();
  await ctxCSSRootFiles.rebuild();
  ctxcss.dispose();
  ctxCSSRootFiles.dispose();
  console.log('disposed context');
}

