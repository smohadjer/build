import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { traverseDir } from './utils.js';

export default {
  registerPartials: (pathToPartial) => {
    const callback = (fullPath) => {
      const extension = path.extname(fullPath);
      const partialPath = fullPath.replace('app/content/', '');
      const partialName = partialPath.replace(extension, '');
      handlebars.registerPartial(partialName, fs.readFileSync(fullPath, 'utf8'));
    };

    traverseDir(pathToPartial, callback);
  }
}
