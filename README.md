Pattern Lab Standard Edition
=======================================

Requirements
------------

1. Install NodeJS: https://nodejs.org/en/download/package-manager/
2. Install bower package manager: http://bower.io/#install-bower
3. Install Gulp: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally

Installation
------------

```bash
npm install && bower install && gulp serve;
```

Development
-----------

See Pattern Lab docs: http://patternlab.io/docs/index.html

Generating and distributing package
-----------------------------------

To generate the distribution package

```bash
gulp publish
```

This will generate the necessary files in the `dist` directory. Then commit and push to the repo.

Using in the site
-----------------

### Download files directly

```bash
bower install git@github.com:Aplyca/patternlab-standard.git#master --save
```

### Using bower.json

Create the file in the public directory of the Bundle:

```json
{
  "name": "patternlab-standard-demo",
  "authors": [
    "Mauricio S <msanchez@aplyca.com>"
  ],
  "description": "Pattern Lab Standard Edition",
  "keywords": [
    "Atomic design"
  ],
  "license": "MIT",
  "homepage": "https://github.com/Aplyca/patternlab-standard",
  "private": true,
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests",
    "vendor/"
  ],
  "main": [
      "public/vendor/patternlab-standard/dist/css/style.css",
      "public/vendor/patternlab-standard/dist/js/app.js"
  ],
  "dependencies": {
    "patternlab-standard": "git@github.com:Aplyca/patternlab-standard.git#master"
  }

}
```

Then install/update with the command:

```bash
bower update
```

### Installing the frontend package

Head

```html
	<meta name="viewport" content="width=device-width, initial-scale=1.0"" />
	<!--
		App CSS
	-->
    <link rel="stylesheet" href="dist/css/style.css" media="all" />
```

Footer

```html
	<script src="../../vendor/fitvids/jquery.fitvids.js"></script>  
```