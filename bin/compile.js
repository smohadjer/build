const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const partials = require('./partials.js');
const registerContent = function(folder, filename) {
  const folderNew = folder.replace('app/pages', 'app/content/pages');
  const path = folderNew + '/' + filename + '.html';
  handlebars.registerPartial(
    'content',
    fs.readFileSync(path, 'utf8')
  )
};

// https://stackoverflow.com/questions/50121881/node-js-recursively-list-full-path-of-files
const traverseDir = function(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
       traverseDir(fullPath);
     } else {
       if (path.extname(fullPath).toLowerCase() === '.hbs') {
        compileFile(fullPath);
       }
     }  
  });
};
const compileFile = function(pathToFile) {
  const extension = path.extname(pathToFile);
  const filename = path.basename(pathToFile, extension);
  const folder = path.dirname(pathToFile);
  const template = fs.readFileSync(pathToFile, 'utf8');

  registerContent(folder, filename);
  const compiled = handlebars.compile(template);
  const html = compiled({});
  const dir = 'public';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  const relativeFolder = folder.replace('app/pages', 'public');
  if (!fs.existsSync(relativeFolder)){
    fs.mkdirSync(relativeFolder);
  }
  const target = relativeFolder + '/' + filename + '.html';
  fs.writeFile(target, html, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(target + ' was saved');
  });
};

partials.registerPartials();

traverseDir('./app/pages');

module.exports = compileFile;
