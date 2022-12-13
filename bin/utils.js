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
    /* taken from: https://stackoverflow.com/a/31632215/884177 */
    handlebars.registerHelper({
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
          return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
          return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      }
    });
  }
}
