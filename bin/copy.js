const config = require('./config.js');
const fse = require("fs-extra");
const path = require('path');
const utils = require('./utils.js');

function copyDependencies(type) {
  if (config.dependencies[type]) {
    config.dependencies[type].forEach(function(source) {
      var filename = path.basename(source);
      var destination = (type === 'js') ? `public/resources/js/lib/${filename}` : `public/resources/css/${filename}`;

      fse.copy(source, destination, function (err) {
          if (err){
              console.log('An error occured while copying the folder.')
              return console.error(err)
          }
      });
    });
  }
}

function copyResources(folder) {
	const srcDir = './app/resources/' + folder;
	const destDir = './public/resources/' + folder;

  if (folder === 'js') {
    //compile typescript files
    utils.traverseDir(srcDir, (filePath) => {
      console.log('js: ', filePath);
      const extension = path.extname(filePath);
      console.log(extension);

      // typescript files are compiled and copied via tsc compiler in npm script
      if (extension !== '.ts') {
        const targetPath = filePath.replace('app/', 'public/');
        fse.copy(filePath, targetPath, function (err) {
          if (err){
            console.log('An error occured while copying the folder.')
            return console.error(err)
          }
          console.log(targetPath, ' copy completed!')
        });
      }
    });
  } else {
    //https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
    try {
      fse.copySync(srcDir, destDir, {overwrite: true});
      console.log(srcDir, 'was copied to ', destDir);
    }
    catch (err) {
      console.error('error: ', err);
    }
  }
}

function copyFile(source, destination) {
	fse.pathExists(source, (err, exists) => {
    if (err) {
      console.log(err, source) // => null
    }

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

function copyFolder(source, destination) {
	if (fse.existsSync(source)) {
		fse.copy(source, destination, function (err) {
			if (err){
				console.log('An error occured while copying the folder.')
				return console.error(err)
			}
			console.log(source, ' copy completed!')
		});
	}
}

copyDependencies('css');
copyDependencies('js');
copyResources('js');

copyFile('app/apple-touch-icon.png', 'public/apple-touch-icon.png');
copyFile('app/favicon.ico', 'public/favicon.ico');
copyFile('app/favicon-16x16.png', 'public/favicon-16x16.png');
copyFile('app/favicon-32x32.png', 'public/favicon-32x32.png');
copyFile('app/android-chrome-192x192.png', 'public/android-chrome-192x192.png');
copyFile('app/android-chrome-512x512.png', 'public/android-chrome-512x512.png');
copyFile('app/site.webmanifest', 'public/site.webmanifest');
copyFile('app/sitemap.xml', 'public/sitemap.xml');

copyFolder('app/assets', 'public/assets');
copyFolder('app/resources/img', 'public/resources/img');
copyFolder('app/resources/fonts', 'public/resources/fonts');
