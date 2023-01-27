const fs = require('fs');
const removeDirectory = (dir) => {
  console.log(fs.existsSync(dir));
  if (fs.existsSync(dir)){
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

removeDirectory('dist');
removeDirectory('public');

