Pattern Lab Standard Edition
=======================================

Requirements
------------

* Install NodeJS: https://nodejs.org/en/download/package-manager/ (`brew install node`)

Optional:

* Install Yarn package manager https://yarnpkg.com/en/docs/install (`brew install yarn`)

Installation
------------

```bash
npm i
```

Updating the app:

```bash
npm up
```

Start working
-------------

See Pattern Lab docs: http://patternlab.io/docs/index.html

Runnig the server

```bash
npm run start
```

Generating and distributing package
-----------------------------------

To generate the distribution package:

```bash
npm run bundle
```
This will generate the necessary files in the `dist` directory.

Pushing your changes:

```bash
npm run push "Commit message"
```
This will push all your changes to the repo.


Bump version:

```bash
npm version <patch|minor|major>
```
This will checkout to master, bump version in `package.json`, create an push the tags.

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
    "patternlab-standard-frontend": "git+ssh://git@github.com:Aplyca/patternlab-standard.git#master"
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
