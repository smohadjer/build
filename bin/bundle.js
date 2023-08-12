import * as esbuild from 'esbuild';

const args = process.argv.slice(2);

let ctxjs = await esbuild.context({
  entryPoints: ['app/resources/js/main.ts'],
  bundle: true,
  outfile: 'public/resources/js/bundle.js',
});

if (args[0] === 'watch') {
  await ctxjs.watch();
  console.log('watching js...');
} else {
  await ctxjs.rebuild();
  ctxjs.dispose();
  console.log('disposed context');
}

let ctxcss = await esbuild.context({
  entryPoints: ['app/resources/css/styles.css'],
  bundle: true,
  loader: {
    '.svg': 'dataurl',
    '.ttf': 'copy'
  },
  outfile: 'public/resources/css/styles.css',
});

if (args[0] === 'watch') {
  await ctxcss.watch();
  console.log('watching css...');
} else {
  await ctxcss.rebuild();
  ctxcss.dispose();
  console.log('disposed context');
}

