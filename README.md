Pattern Lab Standard Edition
============================

Requirements
------------

* NodeJS: https://nodejs.org/en/download/package-manager/ (`brew install node`)


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

### Running the server

```bash
npm start
```

Generating and distributing package
-----------------------------------

### To generate the distribution package:

```bash
npm run bundle
```
This will generate the necessary files in the `dist` directory.

### Pushing your changes:

```bash
npm run push "Commit message"
```
This will push all your changes to the repo.


### Bump version:

```bash
npm version <patch|minor|major>
```
This will checkout to master, bump version in `package.json`, create and push the tags.

### Installing a new package:

```bash
npm install <package_name>@<tag|version>
```

You can also modify the `package.json` file to add the new package.


Using in the site
-----------------

### Download files directly

```bash
npm install git@github.com:Aplyca/patternlab-standard.git#master --save
```

### Using package.json

Create the file in the public directory of the Bundle:

```json
{
  "name": "app",
  "version": "1.0.0",
  "description": "App Frontend",
  "main": "README.md",
  "homepage": "https://github.com/Aplyca/patternlab-standard",
  "repository": {
    "type": "git",
    "url": "git@github.com:Aplyca/patternlab-standard.git"
  },
  "author": "Aplyca",
  "license": "ISC",
  "private": true,  
  "dependencies": {
    "patternlab-standard-frontend": "git+ssh://git@github.com:Aplyca/patternlab-standard.git#master"
  },
  "engines": {
    "node": "~8.2",
    "npm": "~5.3"
  }
}
```

Then install/update with the command:

```bash
npm i --production
```

### How to create a new fronted project

```bash
npm run installkit
```

See the instructions of the starter kit in source/README.md
