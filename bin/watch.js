const compileFile = require('./compile.js');
const fs = require('fs');
const fse = require("fs-extra");
const chokidar = require('chokidar');
const partials = require('./partials.js');
const utils = require('./utils.js');
const path = require('path');
const config = require('./config.js');
const sass = require('./sassToCss.js');
const precompileHbsTemplates = require('./hbs.js');

/* watching js files for bundling */
// https://rollupjs.org/javascript-api/
const rollup = require('rollup');
const inputOptions = {
  input: 'public/resources/js/main.js'
};
const outputOptions = {
  file: 'public/resources/js/bundle.js',
  format: 'iife'
};
const watchOptions = {
  ...inputOptions,
  output: [outputOptions]
};
rollup.watch(watchOptions);

// using cwd option so instead of path we get filename
const watcher = chokidar.watch('.', {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
  ignoreInitial: true,
	cwd: 'app'
});

/* copies assets and resources to public folder */
const copyFile = (filepath) => {
  if (filepath.indexOf('resources/css') >= 0) {
    sass.readCSSDir();
  } else if (filepath.indexOf('resources/hbs') >= 0) {
    precompileHbsTemplates();
  } else {
    const source = 'app/' + filepath;
    const destination = 'public/' + filepath;

    try {
      fse.copySync(source, destination);
    } catch (err) {
      console.error(err)
    }
  }
};

const compileHbs = (filepath) => {
  const folder = path.dirname(filepath);
  let str = '';
  let index, subfolder;

  if (folder.indexOf('partials') >= 0 ) {
    str = 'partials';
    index = folder.indexOf(str);
    subfolder = folder.substring(0, index);
  } else if (folder.indexOf('pages') >= 0 ) {
    str = 'pages';
    index = folder.indexOf(str);
    subfolder = folder.substring(0, index);
  } else if (folder === '.') {
    // layout file in content root has been changed
    subfolder = '';
  } else {
    // layout file in a subfolder has been changed
    subfolder = folder + '/';
  }

  const sourceFolder = 'app/' + subfolder;

  config.pages.forEach(page => {
    if (page.source + '/' === sourceFolder) {
      partials.registerPartials(page.source + '/partials');
      utils.traverseDir(page.source + '/pages', function(path) {
        compileFile(path, page.source, page.target);
      });
    }
  });
}

watcher
  .on('add', filepath => {
	  console.log(`File ${filepath} has been added`);
    filepath.indexOf('content') >= 0 ? compileHbs(filepath) : copyFile(filepath);
  })
  .on('change', filepath => {
	  console.log(`File ${filepath} has been changed`);
    filepath.indexOf('content') >= 0 ? compileHbs(filepath) : copyFile(filepath);
  })
  .on('unlink', filepath => {
	  console.log(`File ${filepath} has been removed`);
    const path = 'public/' + filepath;
    fs.unlinkSync(path);
  });
