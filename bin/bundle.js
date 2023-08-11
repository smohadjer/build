import * as esbuild from 'esbuild';

const args = process.argv.slice(2);

console.log('build type: ', args[0]);

if (args[0] === 'js') {
  let ctx = await esbuild.context({
    entryPoints: ['app/resources/js/main.ts'],
    bundle: true,
    outfile: 'public/resources/js/bundle.js',
  });

  if (args[1] === 'watch') {
    await ctx.watch();
  } else {
    ctx.rebuild();
  }
}

/*
if (args[0] === 'css') {
  let ctxcss = await esbuild.context({
    entryPoints: ['app/resources/css/styles.css'],
    bundle: true,
    loader: {
      '.svg': 'dataurl',
      '.ttf': 'copy'
    },
    outfile: 'public/resources/css/styles.css',
  });

  if (args[1] === 'watch') {
    await ctxcss.watch();
    console.log('watching css...');
  }
}
*/
