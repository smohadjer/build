const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const utils = require('./utils.js');

module.exports = {
  registerPartials: () => {
    const callback = (fullPath) => {
      const extension = path.extname(fullPath);
      const partialName = path.basename(fullPath, extension);
      handlebars.registerPartial(partialName, fs.readFileSync(fullPath, 'utf8'));
    };

    utils.traverseDir('app/content/partials', callback);
  }
}
