Pattern Lab Standard Edition
=======================================

Requirements
------------

1. Install NodeJS: https://nodejs.org/en/download/package-manager/ (`brew isntall node`)
2. Install Yarn package manager https://yarnpkg.com/en/docs/install (`brew install yarn`)
3. Install bower package manager: http://bower.io/#install-bower (`npm install -g bower`)
4. Install Gulp CLI: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally (`npm install -g gulp-cli`)

Installation
------------

```bash
yarn run update
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
yarn run update;
```

Loading a starter kit:

```bash
yarn run starterkit;
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
      "/dist/css/all.min.css",
      "/dist/js/all.min.js"
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
    <link rel="stylesheet" href="/dist/css/patternlab-standard.min.css" media="all" />
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
	<script src="/dist/js/patternlab-standard.min.js"></script>     
```

Cretae a new project using this as boilerplate
-------------------------------------------

```bash
git clone git@github.com:Aplyca/patternlab-standard.git new.project-frontend;
cd new.project-frontend;
rm -rf .git;
find ./ -type f -exec sed -i '' -e 's/patternlab-standard/project-frontend/g' {} \;
find . -name "patternlab-standard.*" -exec sh -c 'mv "$1" "$(dirname ${1})/project-frontend."${1##*.}""' _ {} \;
```
