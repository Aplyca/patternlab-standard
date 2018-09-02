requirements: UNAME := $(shell uname)
requirements:
ifeq ($(UNAME), Darwin)
	grep -q 'brew' <<< echo `command -v brew` || /usr/bin/ruby -e "`curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install`"
	brew install make git node
else ifeq ($(UNAME), Linux)
	sudo apt-get -y install make git node
else ifeq ($(UNAME), Windows_NT)
	@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
	choco install make git node -y
else
	# Platform not supported
endif
	npm i -g npm

build:
ifeq (,$(wildcard ./package-lock.json))
	npm i
else
	npm ci
endif
	make compile
	make start

compile:
	npm run compile

bundle:
	npm run bundle

start:
	npm start

open: ## Open web app in the browser
	$(open) http://localhost:3000

expose: ## Expose your local environment to the internet, thanks to Serveo (https://serveo.net)
	ssh -R 80:localhost:3000 serveo.net

release: type := patch
release:
	git checkout master
	npm version $(type)
	git push && git push --tags

deploy:	bucket ?= patternlab-standard-static-prod
deploy: app_name ?= patternlab-standard
deploy: version := $(shell git describe --always --abbrev=0 --tags)
deploy: endpoint ?= https://static.example.com
deploy: bundle sync
	aws s3 sync dist/ s3://$(bucket)/$(app_name)/$(version)/dist/ --cache-control "max-age=31557600" --no-progress
	aws s3 sync public/ s3://$(bucket)/$(app_name)/$(version)/public/ --cache-control "max-age=31557600" --no-progress
	$(open) $(endpoint)/$(app_name)/$(version)/public/index.html

preview: bucket ?= patternlab-standard-static-review
preview: version  ?= $(shell git rev-parse --abbrev-ref HEAD)
preview: test ## Preview current branch in S3
	make deploy bucket=$(bucket) version=$(version) cache=no-cache endpoint=https://$(bucket).s3.us-east-1.amazonaws.com
