const fse = require("fs-extra");
const chokidar = require('chokidar');
const src = 'app/resources/img/';
const dest = 'public/resources/img/';

// using cwd option so instead of path we get filename
const watcher = chokidar.watch('.', {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
	cwd: src
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => {
	  log(`File ${path} has been added`);
	  copyFile(src + path, dest + path);
  })
  .on('change', path => {
	  log(`File ${path} has been changed`);
	  copyFile(src + path, dest + path);
  })
  .on('unlink', path => {
	  log(`File ${path} has been removed`);
	  fse.unlink(dest + path);
  });

function copyFile(source, destination) {
	fse.pathExists(source, (err, exists) => {
		//console.log(err);

		if (exists) {
			fse.copy(source, destination, function (err) {
				if (err){
					console.log('An error occured while copying the folder.')
					return console.error(err)
				}
				console.log(source, ' copy completed!')
			});
		}
	});
}
