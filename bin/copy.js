import * as fs from 'fs';
import * as path from 'path';
import {traverseDir} from './utils.js';
import config from './config.js';
import * as fse from 'fs-extra/esm';

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
    traverseDir(srcDir, (filePath) => {
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
	if (fs.existsSync(source)) {
		fse.copy(source, destination, function (err) {
			if (err){
				console.log('An error occured while copying the folder.')
				return console.error(err)
			}
			console.log(source, ' copy completed!')
		});
	}
}

function copyRootFiles(source, target) {
  fs.readdir(source, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    files.forEach(function (file) {
        if (file !== '.DS_Store' && fs.lstatSync(path.join(source,file)).isFile()) {
          copyFile(path.join(source,file),path.join(target,file));
        }
    });
  });
}

copyDependencies('css');
copyDependencies('js');
copyResources('js');

copyRootFiles('app', 'public');

copyFolder('app/assets', 'public/assets');

// resource images are inserted into css as data urls by esbuild and fonts are copied by esbuild
//copyFolder('app/resources/img', 'public/resources/img');
//copyFolder('app/resources/fonts', 'public/resources/fonts');
