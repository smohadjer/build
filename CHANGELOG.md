# Changelog

## 2.0.16
* sends category to tempaltes for helping rendering subnavs

## 2.0.14
* adds file loader for images when bundling css files

## 2.0.13
* Updates dependencies

## 2.0.6

* Updates bundle.js to watch css and js files in root of css and js folder for files that don't get bundled as they are only used in specific pages.

## 2.0.5

* Updated copy.js to allow copying .css files in 'resources/css' folder to public folder, except files in modules folder which get bundled into styles.css.

## 2.0.3

* Adds target property to esbuild to allow use of nesting in css files

## 2.0.2

* Removes support for Sass. CSS modules are now bundled via esbuild and css images are inserted as Data URLs in css. ([commit](https://github.com/smohadjer/build/commit/a0963cc0f3d6b1b3954d75da089abe53d28ce330))
