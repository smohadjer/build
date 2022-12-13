const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const partials = require('./partials.js');
const utils = require('./utils.js');
const compileFile = function(pathToFile) {
  const extension = path.extname(pathToFile);
  const filename = path.basename(pathToFile, extension);
  const folder = path.dirname(pathToFile);
  const source = fs.readFileSync('app/layout.hbs', 'utf8');
  handlebars.registerPartial(
    'content',
    fs.readFileSync(pathToFile, 'utf8')
  )
  const template = handlebars.compile(source);
  const html = template({pageId: filename});
  const dir = 'public';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  const relativeFolder = folder.replace('app/content/pages', 'public');
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

utils.registerHandlebarsHelpers();
partials.registerPartials();
utils.traverseDir('./app/content/pages', compileFile);
module.exports = compileFile;
