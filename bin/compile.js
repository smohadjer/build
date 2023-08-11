import * as fs from 'fs';
import * as path from 'path';
import config from './config.js';
import Handlebars from "handlebars";
import partials from './partials.js';
import {traverseDir, registerHandlebarsHelpers} from './utils.js';

const compileFile = function(pathToPage, sourceFolder, targetFolder) {
  const pathToLayout = sourceFolder + '/layout.hbs';
  const extension = path.extname(pathToPage);
  if (extension !== '.html') return;
  const filename = path.basename(pathToPage, extension);
  const folder = path.dirname(pathToPage);
  const source = fs.readFileSync(pathToLayout, 'utf8');

  Handlebars.registerPartial(
    'content',
    fs.readFileSync(pathToPage, 'utf8')
  )

  const getMeta = (metaFile, page_id) => {
    const metaPath = path.join(sourceFolder, metaFile);
    try {
      const fileContent = fs.readFileSync(metaPath, 'utf8');
      const json = JSON.parse(fileContent);
      const meta = json[page_id] || json.index;
      return meta;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  const template = Handlebars.compile(source);
  /* using substring(1) to remove slash from id */
  const subFolder = folder.replace(sourceFolder + '/pages', '');
  const page_id = (subFolder + '/' + filename).substring(1);
  const html = template({
    pageId: page_id,
    pageTitle: getMeta('pageTitle.json', page_id),
    pageDescription: getMeta('pageDescription.json', page_id)
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

registerHandlebarsHelpers();

config.pages.forEach(page => {
  partials.registerPartials(page.source + '/partials');
  traverseDir(page.source + '/pages', function(path) {
    compileFile(path, page.source, page.target);
  });
});

export default compileFile;
