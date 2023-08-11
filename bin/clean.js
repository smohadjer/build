import * as fs from 'fs';

const removeDirectory = (dir) => {
  console.log(fs.existsSync(dir));
  if (fs.existsSync(dir)){
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

removeDirectory('public');

