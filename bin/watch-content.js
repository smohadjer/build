const compilesFile = require('./compile.js');
const fse = require("fs-extra");
const chokidar = require('chokidar');
const partials = require('./partials.js');
const src = 'app/content';
const dest = 'public';
const path = require('path');


// using cwd option so instead of path we get filename
const watcher = chokidar.watch('.', {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
  ignoreInitial: true,
	cwd: src
});

const compileHbs = (filepath) => {
  const extension = path.extname(filepath);
  const file = 'app/' + path.basename(filepath, extension) + '.hbs';
  compilesFile(file);
}

const compileAllFiles = () => {
  fse.readdirSync(src).forEach(file => {
    const path = src + '/' + file;
    if (fse.statSync(path).isFile() && path.indexOf('.DS_Store') < 0) {
      compileHbs(path);
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
      if (filepath.indexOf('shared') >= 0) {
        console.log('Compiling all pages...');
        partials.registerPartials();
        compileAllFiles();
      } else {
        console.log('Compiling ', filepath);
        compileHbs(filepath);
      }
    }
  })
  .on('unlink', filepath => {
	  log(`File ${filepath} has been removed`);
	  //fse.unlink(dest + filepath);
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

	/*
  fse.pathExists(source, (err, exists) => {
		console.log(err);
    console.log(exists);
    console.log(filepath);

		if (exists) {
      console.log(source, destination);
			fse.copy(source, destination, function (err) {
				if (err){
					console.log('An error occured while copying the folder.')
					return console.error(err)
				}
				console.log(source, ' copy completed!')
			});
		}
	});
  */
}
