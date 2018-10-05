# Pattern Lab Standard Edition

## Prerequesites

- GNU Make

## Override configurations and settings

Create the file `.env` with the environment variables, use the `.env.dist` file for reference. Reload your environment (`make reload`) in order to make this variables take effect

## Install requirements:

```bash
make requirements
```

## Installation

```bash
make
```

## Start working

See Pattern Lab docs: <http://patternlab.io/docs/index.html>

### Pushing the changes to the repo

- This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for releasing new versions
- This projects adheres to [Conventional Commits](https://conventionalcommits.org) for commit guidelines
- This project uses [Semantic Realease](https://semantic-release.gitbook.io/semantic-release) to automatically release a new version depending on commits messages
- This project uses [Semantic Release Changelog](https://github.com/semantic-release/changelog) to automatically generate CHANGELOG.md file

Execute the following command to push your changes

```bash
make push
```

The command above will pormnt some questions to help you create a good commit message in compliance to the semantic release.

This project uses semantic release to deploy to **CloudFront CDN** depending on the commit messages in the `master` branch.

### Starting the environment

```bash
make start
```

### Stopping the environment

```bash
make stop
```

### Execute tests

```bash
make test
```

### Open your environment in the browser

```bash
make open
```

### See all commands available

```bash
make help
```

## Deploy preview to S3

```bash
make preview
```

## Release to CDN

```bash
make publish
```
