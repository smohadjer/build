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

  const getPageTitle = (page_id) => {
    const pathToTitles = sourceFolder + '/pageTitle.json';
    try {
      const titles = fs.readFileSync(pathToTitles, 'utf8');
      const titlesJson = JSON.parse(titles);
      const page_title = titlesJson[page_id] || titlesJson.index;
      return page_title;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  const template = handlebars.compile(source);
  /* using substring(1) to remove slash from id */
  const subFolder = folder.replace(sourceFolder + '/pages', '');
  const page_id = (subFolder + '/' + filename).substring(1);
  const html = template({
    pageId: page_id,
    pageTitle: getPageTitle(page_id)
  });
  const pageFolder = targetFolder + subFolder;

  if (!fs.existsSync(pageFolder)){
    fs.mkdirSync(pageFolder, { recursive: true });
  }

  const target = pageFolder + '/' + filename + '.html';
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
