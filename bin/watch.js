const compileFile = require('./compile.js');
const fs = require('fs');
const fse = require("fs-extra");
const chokidar = require('chokidar');
const partials = require('./partials.js');
const utils = require('./utils.js');
const path = require('path');
const config = require('./config.js');
const sass = require('sass');

// using cwd option so instead of path we get filename
const watcher = chokidar.watch('.', {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
  ignoreInitial: true,
	cwd: 'app'
});

const watchCSS = () => {
  sass.render({
    file: './app/resources/css/styles.scss',
    includePaths: ['./app/resources/css/modules/']
  }, function(err, result) {
    if(!err) {
        // No errors during the compilation, write this result on the disk
        fs.writeFile('public/resources/css/styles.css', result.css, function(err){
          if(!err){
            //file written on disk
          }
        });
    } else {
      console.log(err);
    }
  });
};

/* copies assets and resources to public folder */
const copyFile = (filepath) => {
  if (filepath.indexOf('resources/css') >= 0) {
    watchCSS();
  } else {
    const source = 'app/' + filepath;
    const destination = 'public/' + filepath;

    fse.copy(source, destination, function (err) {
      if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
      }
      console.log(source, ' copy completed!')
    });
  }
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
