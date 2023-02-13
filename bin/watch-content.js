const compileFile = require('./compile.js');
var fs = require('fs');
const fse = require("fs-extra");
const chokidar = require('chokidar');
const partials = require('./partials.js');
const utils = require('./utils.js');
const path = require('path');
const config = require('./config.js');

// using cwd option so instead of path we get filename
const watcher = chokidar.watch('.', {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
  ignoreInitial: true,
	cwd: 'app'
});

/* copies assets from content folder to public folder */
const copyFile = (filepath) => {
  console.log('filepath:', filepath);
  const source = 'app/' + filepath;
  const destination = 'public/' + filepath;

  fse.copy(source, destination, function (err) {
    if (err){
      console.log('An error occured while copying the folder.')
      return console.error(err)
    }
    console.log(source, ' copy completed!')
  });
};

const compileHbs = (filepath) => {
  const folder = path.dirname(filepath);
  let str = '';
  let index, subfolder;

  console.log('folder: ', folder);

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
  console.log('sourceFolder: ', sourceFolder);

  console.log('Compiling all pages...');
  config.pages.forEach(page => {
    console.log('sourceFolder: ', sourceFolder);
    if (page.source + '/' === sourceFolder) {
      partials.registerPartials(page.source + '/partials');
      utils.traverseDir(page.source + '/pages', function(path) {
        compileFile(path, page.source, page.target);
      });
    }
  });
}

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', filepath => {
	  log(`File ${filepath} has been added`);
    if (filepath.indexOf('assets') >= 0) {
      console.log('Copying asset to public folder...');
      copyFile(filepath);
    } else {
      console.log('Compiling page...');
      compileHbs(filepath);
    }
  })
  .on('change', filepath => {
	  log(`File ${filepath} has been changed`);

    if (filepath.indexOf('assets') >= 0) {
      console.log('Copying asset to public folder...');
      copyFile(filepath);
    } else {
      compileHbs(filepath);
    }
  })
  .on('unlink', filepath => {
	  log(`File ${filepath} has been removed`);
    const path = 'public/' + filepath;
    fs.unlinkSync(path);
  });
