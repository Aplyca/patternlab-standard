requirements: ## Installing local requirements
ifeq ($(os), Darwin)
	grep -q 'brew' <<< echo `command -v brew` || /usr/bin/ruby -e "`curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install`"
	brew install make git
	brew cask install docker
	open -a Docker
else ifeq ($(os), Linux)
	sudo sh -c "$$(curl -fsSL https://get.docker.com)"
	sudo apt-get install make git
	sudo usermod -aG docker $${USER}
	sudo service docker start
	sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(os)-$(shell uname -m) -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	su - $${USER}
else ifeq ($(os), Windows_NT)
	@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
	choco install make git docker-for-windows -y
else
	$(warning Platform "$(os)" not supported)
endif

build: ## 📦  Build the ap in Docker containers
	docker-compose up --build -d --remove-orphans $(container)

up:
	docker-compose up -d

reload: up ## Reload environment

down:
	docker-compose down

stop:
	docker-compose stop

start:
	docker-compose start

restart:
	docker-compose restart app

reboot: down up

ps: ## Status of the environment
	docker-compose ps

status: ps

cli exec: container ?= app
cli exec: ## Execute commands in containers, use "command"  argument to send the command. By Default enter the shell.
	docker-compose exec $(container) ash $(command)

run: container ?= app
run: ## 👟  Run commands in a new container
	docker-compose run --rm $(container) ash $(command)

bundle:
	make exec command="npm run bundle"

compile: ## Compile PatternLab files
	make exec command="npm run compile"

config:
	docker-compose config

logs: ## See logs of the containers
	docker-compose logs -f app

open: ## Open web app in the browser
	$(open) $(subst 0.0.0.0,localhost,http://$(shell docker-compose port app 3000))

expose: ## 🌐  Expose your local environment to the internet, thanks to Serveo (https://serveo.net)
	ssh -R 80:localhost:$(subst 0.0.0.0:,,$(shell docker-compose port app 3000)) serveo.net

copy: ## Copy app files/directories from container to host
	docker cp $(shell docker-compose ps -q app):/app/$(path) .

sync: ## Copy files generated inside container to host
	make copy path=package.json
	make copy path=package-lock.json

sync.generated: ## Copy files generated inside container to host
	make copy path=public
	make copy path=dist

sync.all: sync sync.generated ## Copy files generated inside container to host

release:
	git checkout master
	docker run --rm -it -v $(CURDIR):/app -v ~/.ssh:/root/.ssh -w /app aplyca/semantic-release ash -c "semantic-release --no-ci"
	git pull

deploy:	bucket ?= patternlab-standard-static-prod
deploy: app_name ?= patternlab-standard
deploy: version ?= $(shell git describe --always --abbrev=0 --tags)
deploy: cache ?= max-age=31557600
deploy: endpoint ?= https://static.example.com
deploy: bundle sync.generated ## 🚀  Deploy code to S3
	$(info 🚀  Uploading current files to s3://$(bucket)/$(app_name)/$(version)) 
	@docker run --rm -it -v $(CURDIR):/app --env AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} --env AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} -w /app garland/aws-cli-docker ash -c "aws s3 sync dist/ s3://$(bucket)/$(app_name)/$(version)/dist/ --cache-control "$(cache)" --only-show-errors && aws s3 sync public/ s3://$(bucket)/$(app_name)/$(version)/public/ --cache-control "$(cache)" --only-show-errors"
	$(open) $(endpoint)/$(app_name)/$(version)/public/index.html

review: bucket ?= patternlab-standard-static-review
review: version  ?= $(shell git rev-parse --abbrev-ref HEAD)
review: test ## Preview current branch in S3
	make deploy bucket=$(bucket) version=$(version) cache=no-cache endpoint=https://$(bucket).s3.us-east-1.amazonaws.com
