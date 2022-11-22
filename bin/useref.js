var fs = require('fs');
var path = require('path');
var useref = require('useref');

function fread(f) {
  return fs.readFileSync(f, { encoding: 'utf-8'});
}

function writeToFile(result, file) {
	const extension = path.extname(file);
  const filename = path.basename(file, extension);
	const folder = path.dirname(file);
	const targetFolder = folder.replace('public', 'dist');
  if (!fs.existsSync(targetFolder)){
    fs.mkdirSync(targetFolder);
  }

	fs.writeFile(targetFolder + '/' + filename + '.html', result[0], function(err) {
		if(err) {
			return console.log(err);
		}
		console.log(file + ' was saved!');
	});
}

// https://stackoverflow.com/questions/50121881/node-js-recursively-list-full-path-of-files
const traverseDir = function(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
       traverseDir(fullPath);
     } else {
       if (path.extname(fullPath).toLowerCase() === '.html') {
					const html = fread(fullPath);
					const result = useref(html);
					writeToFile(result, fullPath);
       }
     }  
  });
};

traverseDir('./public');
