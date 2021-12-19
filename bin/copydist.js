var fs = require("fs-extra");
var concat = require("concat");

fs.mkdirSync('dist/resources/css', { recursive: true }, (err) => {
	if (err) throw err;
});

fs.mkdirSync('dist/resources/js', { recursive: true }, (err) => {
	if (err) throw err;
});

concat([
  'public/resources/js/handlebars.runtime.js',
  'public/resources/js/handlebars.templates.js'], 
  'dist/resources/js/bundle.js');
concat('public/resources/css', 'dist/resources/css/styles.min.css');

copyFile('app/apple-touch-icon.png', 'dist/apple-touch-icon.png');

copyFolder('public/assets', 'dist/assets');
copyFolder('public/resources/img', 'dist/resources/img');
copyFolder('public/resources/fonts', 'dist/resources/fonts');

function copyFile(source, destination) {
	fs.pathExists(source, (err, exists) => {
    if (err) {
      console.log(err, source) // => null
    }

		if (exists) {
			fs.copy(source, destination, function (err) {
				if (err){
					console.log('An error occured while copying the folder.')
					return console.error(err)
				}
				console.log(source, ' copy completed!')
			});
		}
	});
}

function copyFolder(source, destination) {
	if (fs.existsSync(source)) {
		fs.copy(source, destination, function (err) {
			if (err){
				console.log('An error occured while copying the folder.')
				return console.error(err)
			}
			console.log(source, ' copy completed!')
		});
	}
}
