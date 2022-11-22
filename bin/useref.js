const fs = require('fs');
const path = require('path');
const useref = require('useref');
const utils = require('./utils.js');

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

const userefIt = function(fullPath) {
  if (path.extname(fullPath).toLowerCase() === '.html') {
    const html = fread(fullPath);
    const result = useref(html);
    writeToFile(result, fullPath);
  }
};

utils.traverseDir('./public', userefIt);
