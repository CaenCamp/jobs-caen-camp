.PHONY: install start stop log

export UID = $(shell id -u)
export GID = $(shell id -g)

export NODE_ENV ?= development

DOCKER_API := docker run --rm -v ${PWD}:/jobboard -u=${UID} -w /jobboard/apps/api node:12.14-alpine

help: ## Display available commands
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =====================================================================
# Initialization ======================================================
# =====================================================================

install: ## Install all js deps
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn \
	'

install-cypress: ## Install cypress.io bin on local environment, not in Docker !
	@node_modules/.bin/cypress install

# =====================================================================
# Operating recipies ==================================================
# =====================================================================

start: ## Start all service in containers
	docker-compose up -d

stop: ## Stop all containers
	docker-compose down

logs: ## Display all logs
	docker-compose logs -f

# =====================================================================
# OpenAPI =============================================================
# =====================================================================

openapi: openapi-validate openapi-bundle ## Bundle then validate the OpenAPI schema

openapi-bundle: ## Bundle the OpenAPI schema
	@$(DOCKER_API) yarn openapi:bundle

openapi-validate: ## Validate the OpenAPI schema
	@$(DOCKER_API) yarn openapi:check

# =====================================================================
# Testing =============================================================
# =====================================================================

DC_TEST = docker-compose -p cc-jobboard-test -f docker-compose-test.yml

test: test-unit test-e2e ## launch all tests in docker

test-unit: ## launch only tests unit (front and api)
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn test \
	'

test-unit-watch: ## launch only tests unit in watch mode
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn test:watch \
	'
test-e2e: ## Run whole e2e tests suite
	@${MAKE} --quiet test-env-start
	@($(MAKE) --quiet test-env-run && $(MAKE) --quiet test-env-stop) || ($(MAKE) --quiet test-env-stop && exit 1)

# Manual recipes for e2e test (api with frisby and front with cypress)
test-env-start: build-front
	@${DC_TEST} up -d
test-env-stop:
	@${DC_TEST} down
test-env-logs:
	@${DC_TEST} logs -f
test-env-run:
	@${DC_TEST} run --rm jobboard ash -ci '\
		cd ../../tests-e2e && \
		yarn test \
	'
test-env-watch:
	@${DC_TEST} run --rm jobboard ash -ci '\
		cd ../../tests-e2e && \
		yarn test:watch \
	'
cypress:
	@cd tests-e2e && yarn cypress:open

# =====================================================================
# Build ===============================================================
# =====================================================================

build-front: ## Build the front
	@docker-compose run --rm --no-deps front ash -ci '\
		rm -f public/bundle.* && \
		yarn build \
	'
