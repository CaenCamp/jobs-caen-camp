.PHONY: install start stop log

export UID = $(shell id -u)
export GID = $(shell id -g)

export NODE_ENV ?= development

help: ## Display available commands
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all js deps
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn \
	'

start: ## Start all service in containers
	docker-compose up -d

stop: ## Stop all containers
	docker-compose down

logs: ## Display all logs
	docker-compose logs -f

tests: ## launch all tests in docker
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn tests \
	'

tests-watch: ## launch all tests in docker
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn tests:watch \
	'
