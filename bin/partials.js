const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const utils = require('./utils.js');

module.exports = {
  registerPartials: (pathToPartial) => {
    const callback = (fullPath) => {
      const extension = path.extname(fullPath);
      const partialPath = fullPath.replace('app/content/', '');
      const partialName = partialPath.replace(extension, '');
      handlebars.registerPartial(partialName, fs.readFileSync(fullPath, 'utf8'));
    };

    utils.traverseDir(pathToPartial, callback);
  }
}
