import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';

const dir = 'app/resources/css';
const targetDir = dir.replace('app/', 'public/');
const convertToCSS = (fullPath, targetPath) => {
  console.log('converting ', fullPath, ' to css...');
  sass.render({
    file: fullPath,
    //includePaths: ['./app/resources/css/modules/']
  }, function(err, result) {
    if(!err) {
        // No errors during the compilation, write this result on the disk
        if (!fs.existsSync(targetDir)){
          fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFile(targetPath, result.css, function(err){
          if(!err){
            //file written on disk
          }
        });
    } else {
      console.error(err);
    }
  });
};

const readCSSDir = () => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const targetPath = fullPath.replace('app/', 'public/');
    const targetCSS = targetPath.replace('.scss', '.css');

    // to exclude modules folder
    if (!fs.lstatSync(fullPath).isDirectory()) {
      convertToCSS(fullPath, targetCSS);
    }
  });
}

readCSSDir();

export default { readCSSDir }


