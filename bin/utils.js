const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

module.exports = {
  // https://stackoverflow.com/questions/50121881/node-js-recursively-list-full-path-of-files
  traverseDir: (dir, callback) => {
    const myRecursiveFunction = function(dir, callback) {
      fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          myRecursiveFunction(fullPath, callback);
        } else {
          callback(fullPath);
        }  
      });
    };

    myRecursiveFunction(dir, callback);
  },
  registerHandlebarsHelpers: () => {
    handlebars.registerHelper('ifeq', function (a, b, options) {
      if (a == b) { return options.fn(this); }
      return options.inverse(this);
    });
    handlebars.registerHelper('ifnoteq', function (a, b, options) {
      if (a != b) { return options.fn(this); }
      return options.inverse(this);
    });
  }
}
