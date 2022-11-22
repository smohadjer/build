const fs = require('fs');
const path = require('path');

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
  }
}
