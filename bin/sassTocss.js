var fs = require('fs');
var sass = require('sass');

sass.render({
  file: './app/resources/css/styles.scss',
  includePaths: ['./app/resources/css/modules/']
}, function(err, result) {
  if(!err) {
      // No errors during the compilation, write this result on the disk
      fs.writeFile('public/resources/css/styles.css', result.css, function(err){
      if(!err){
        //file written on disk
      }
      });
  } else {
    console.log(err);
  }
});
