const config = require('./config.js');
const fse = require("fs-extra");
const path = require('path');

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

	//https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
	try {
		fse.copySync(srcDir, destDir, {overwrite: true});
		console.log(srcDir, 'was copied to ', destDir);
	}
	catch (err) {
		console.error('error: ', err);
	}
}

function copyAssets() {
	const srcDir = './app/assets';
	const destDir = './public/assets/';

	//https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
	try {
		fse.copySync(srcDir, destDir, {overwrite: true});
    console.log(srcDir, 'was copied to ', destDir);
	}
	catch (err) {
		console.error('error: ', err);
	}
}

copyDependencies('css');
copyDependencies('js');
copyResources('img');
copyResources('fonts');
copyResources('js');
copyAssets();
