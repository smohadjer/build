import * as fs from 'fs';
import * as path from 'path';
import Handlebars from "handlebars";

// https://stackoverflow.com/questions/50121881/node-js-recursively-list-full-path-of-files
const traverseDir = (dir, callback) => {
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
};

const registerHandlebarsHelpers = () => {
  /* taken from: https://stackoverflow.com/a/31632215/884177 */
  Handlebars.registerHelper({
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
};

export {traverseDir, registerHandlebarsHelpers};

