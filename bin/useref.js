var fs = require('fs');
var path = require('path');
var useref = require('useref');

function djoin(p) {
  console.log('__dirname:', __dirname);
  return path.normalize(path.join(__dirname, p));
}

function fread(f) {
  return fs.readFileSync(f, { encoding: 'utf-8'});
}

function writeToFile(result, file) {
	fs.writeFile('dist/' + file, result[0], function(err) {
		if(err) {
			return console.log(err);
		}
		console.log(file + ' was saved!');
	});
}

var files = fs.readdirSync('./public');
var targetFiles = files.filter(function(file) {
	return path.extname(file).toLowerCase() === '.html';
});

targetFiles.forEach(function(file) {
	var html = fread(djoin('../public/' + file));
	var result = useref(html);
	//console.log(result[1].js);
	writeToFile(result, file);
});
