# Changelog

## 2.0.5

* Updated copy.js to allow copying .css files in 'resources/css' folder to public folder, except files in modules folder which get bundled into styles.css.

## 2.0.3

* Adds target property to esbuild to allow use of nesting in css files

## 2.0.2

* Removes support for Sass. CSS modules are now bundled via esbuild and css images are inserted as Data URLs in css. ([commit](https://github.com/smohadjer/build/commit/a0963cc0f3d6b1b3954d75da089abe53d28ce330))
