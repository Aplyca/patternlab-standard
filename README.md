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
yarn run install
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
yarn run installkit;
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
  "name": "app-frontend",
  "authors": [
    "RockStar Developer <rockstar@example.com>"
  ],
  "description": "App Frontend",
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
      "/dist/css/app.css",
      "/dist/js/app.js"
  ],
  "dependencies": {
    "patternlab-standard": "git@github.com:Aplyca/patternlab-standard.git"
  }

}
```

Then install/update with the command:

```bash
bower update
```

### Installing the frontend package

See the instructions of the starter kit in source/README.md

Cretae a new project using this as boilerplate
-------------------------------------------

```bash
git clone git@github.com:Aplyca/patternlab-standard.git app-frontend;
cd app-frontend;
yarn run install;
yarn run installkit
```
