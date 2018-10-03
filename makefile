# Load custom setitngs
os ?= $(shell uname -s)

-include .env
export
PROVISION ?= docker
include etc/$(PROVISION)/makefile

ifdef command
override command := -c "$(command)"
endif

ifeq ($(os), Darwin)
open = open
else ifeq ($(os), Linux)
open = xdg-open
else ifeq ($(os), Windows_NT)
open = explorer
endif

install: build bundle test open

squash: branch := $(shell git rev-parse --abbrev-ref HEAD)
squash:
	git rebase -i $(shell git merge-base origin/$(branch) origin/master)
	git push -f

push: branch := $(shell git rev-parse --abbrev-ref HEAD)
push: ## Review, add, commit and push changes using commitizen. Usage: make push
	git diff
	git add -A .
	git cz -a
	git pull origin $(branch)
	git push -u origin $(branch)

checkoutlatesttag:
	git fetch --prune origin "+refs/tags/*:refs/tags/*"
	git checkout $(shell git describe --always --abbrev=0 --tags)

checknewrelease:
	git describe --tags --exact-match $(shell git rev-parse HEAD)

publish: test release checknewrelease checkoutlatesttag deploy ## 🎉  Publish new version to Prodcution
	git checkout master

test:
	@echo "Not implemented yet"

h help: ## ℹ️  This help.
	@echo 'ℹ️  Usage: make <task> [option=value]' 
	@echo 'Default task: install'
	@echo
	@echo '🛠️  Tasks:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9., _-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := install
.PHONY: all
