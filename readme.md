You can use this build to run and deploy static Websites. To use it add the following section to your package.json of your project:

````
	"scripts": {
		"precompile": "node node_modules/build/bin/clean.js",
		"compile": "node node_modules/build/bin/compile.js",
		"copy": "node node_modules/build/bin/copyPublic.js",
		"copyDist": "node node_modules/build/bin/copydist.js",
		"sass": "node node_modules/build/bin/sassTocss",
		"hbs": "node node_modules/build/bin/hbs.js",
		"watch": "node node_modules/build/bin/watch.js & node node_modules/build/bin/watch-css.js",
		"server": "node node_modules/build/bin/server.js",
		"serve": "npm run compile && npm run copy && npm run sass && npm run hbs",
		"start": "npm run serve && npm run watch & npm run server -- public",
		"build": "npm run serve && rollup -c && npm run copyDist",
		"start-prod": "npm run build && npm run server -- dist 3001"
	},
	"devDependencies": {
		"build": "git://github.com/smohadjer/build.git#0.1.15"
	}
````
