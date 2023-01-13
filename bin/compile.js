const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const handlebars = require('handlebars');
const partials = require('./partials.js');
const utils = require('./utils.js');

const compileFile = function(pathToPage, sourceFolder, targetFolder) {
  const pathToLayout = sourceFolder + '/layout.hbs';
  const extension = path.extname(pathToPage);
  if (extension !== '.html') return;
  const filename = path.basename(pathToPage, extension);
  const folder = path.dirname(pathToPage);
  const source = fs.readFileSync(pathToLayout, 'utf8');
  handlebars.registerPartial(
    'content',
    fs.readFileSync(pathToPage, 'utf8')
  )
  const template = handlebars.compile(source);
  /* using substring(1) to remove slash from id */
  const page_id = (folder.replace(sourceFolder+'/pages', '') + '/' + filename).substring(1);
  const html = template({pageId: page_id});

  const dir = 'public';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  if (!fs.existsSync(targetFolder)){
    fs.mkdirSync(targetFolder);
  }
  const target = targetFolder + '/' + filename + '.html';
  fs.writeFile(target, html, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(target + ' was saved');
  });
};

utils.registerHandlebarsHelpers();

config.pages.forEach(page => {
  partials.registerPartials(page.source + '/partials');
  utils.traverseDir(page.source + '/pages', function(path) {
    compileFile(path, page.source, page.target);
  });
});

module.exports = compileFile;
