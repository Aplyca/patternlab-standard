Pattern Lab Standard Edition
=======================================

Requirements
------------

* Install NodeJS: https://nodejs.org/en/download/package-manager/ (`brew install node`)
* Install Gulp CLI: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally (`npm install -g gulp-cli`)

Optional:

* Install Yarn package manager https://yarnpkg.com/en/docs/install (`brew install yarn`)

Installation
------------

```bash
npm i
```

Start working
-------------

See Pattern Lab docs: http://patternlab.io/docs/index.html

Runnig the server

```bash
npm run start
```

Updating the app:

```bash
npm up
```

Generating and distributing package
-----------------------------------

To generate the distribution package

```bash
npm run pack
```

This will generate the necessary files in the `dist` directory. Then commit and push to the repo.

Using in the site
-----------------

### Download files directly

```bash
npm install git@github.com:Aplyca/patternlab-standard.git#master --save
```

### Using bower.json

Create the file in the public directory of the Bundle:

```json
{
  "name": "app-frontend",
  "version": "0.0.1",
  "description": "App Frontend",
  "main": "README.md",
  "repository": {
    "type": "git",
    "url": "ttps://github.com/Aplyca/patternlab-standard"
  },
  "author": "Aplyca",
  "license": "ISC",
  "dependencies": {
    "tci-frontend": "git+ssh://git@github.com:Aplyca/patternlab-standard.git#master"
  },
  "devDependencies": {}
}
```

Then install/update with the command:

```bash
npm i --production
```

### Installing the frontend package

See the instructions of the starter kit in source/README.md
