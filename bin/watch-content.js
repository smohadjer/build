const compileFile = require('./compile.js');
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
	cwd: 'app/content'
});

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
    const folder = path.dirname(filepath);
    console.log('folder: ', folder);
    if (filepath.indexOf('assets') >= 0) {
      console.log('Copying asset to public folder...');
      copyFile(filepath);
    } else {
      const str = folder.indexOf('partials') >= 0 ? 'partials' : 'pages';
      const index = folder.indexOf(str);
      const subfolder = folder.substring(0, index);
      const sourceFolder = 'app/content' + '/' + subfolder;

      console.log('Compiling all pages...');
      console.log('sourceFolder: ', sourceFolder);
      config.pages.forEach(page => {
        if (page.source + '/' === sourceFolder) {
          partials.registerPartials(page.source + '/partials');
          utils.traverseDir(page.source + '/pages', function(path) {
            compileFile(path, page.source, page.target);
          });
        }
      });
    }
  })
  .on('unlink', filepath => {
	  log(`File ${filepath} has been removed`);
	  //fse.unlink('public' + filepath);
  });

/* copies assets from content folder to public folder */
function copyFile(filepath) {
  console.log(filepath);
  const source = 'app/content/' + filepath;
  const destination = 'public/' + filepath;

  fse.copy(source, destination, function (err) {
    if (err){
      console.log('An error occured while copying the folder.')
      return console.error(err)
    }
    console.log(source, ' copy completed!')
  });
}
