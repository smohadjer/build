const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const partials = require('./partials.js');
const files = fs.readdirSync('./app');
const targetFiles = files.filter(function(file) {
	return path.extname(file).toLowerCase() === '.hbs';
});
const registerContent = function(filename) {
  const path = 'app/content/' + filename + '.html';
  handlebars.registerPartial(
    'content',
    fs.readFileSync(path, 'utf8')
  )
}

const compileFile = function(pathToFile) {
  console.log('file: ', pathToFile);
  const extension = path.extname(pathToFile);
  const filename = path.basename(pathToFile, extension);
  console.log('filename: ', filename);
  const template = fs.readFileSync(pathToFile, 'utf8');
  registerContent(filename);
  const compiled = handlebars.compile(template);
  const html = compiled({});
  const dir = 'public';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  const target = dir + '/' + filename + '.html';
  fs.writeFile(target, html, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(target + ' was saved');
  });
};

partials.registerPartials();

targetFiles.forEach(function(file) {
  compileFile('app/' + file);
});

module.exports = compileFile;





