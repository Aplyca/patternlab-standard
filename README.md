Pattern Lab Standard Edition
=======================================

Requirements
------------

1. Install NodeJS: https://nodejs.org/en/download/package-manager/ (`brew isntall node`)
2. Install bower package manager: http://bower.io/#install-bower (`npm install -g bower`)
3. Install Gulp CLI: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally (`npm install -g gulp-cli`)

Installation
------------

```bash
npm run update
```

Development
-----------

See Pattern Lab docs: http://patternlab.io/docs/index.html

Runnig the server

```bash
gulp serve;
```

Updating the App:

```bash
npm run update;
```

Loading a starter kit:

```bash
npm run update;
```

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
      "/dist/css/style.min.css",
      "/dist/js/app_all.min.js"
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
    <link rel="stylesheet" href="/dist/css/style.min.css" media="all" />
```

Footer

```html
	<!--
		Vendor JS
	-->
	<script src="/vendor/fitvids/jquery.fitvids.js"></script>
	<!--
		App JS
	-->    
	<script src="/dist/js/app_all.min.js"></script>     
```