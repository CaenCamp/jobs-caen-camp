.PHONY: install start stop log

CURRENT_UID=$(id -u):$(id -g)
export CURRENT_UID ?= $(shell id -u):$(shell id -g)
export NODE_ENV ?= development

DOCKER := docker run --rm -v ${PWD}:/jobboard -u=${CURRENT_UID} -w /jobboard node:12.14-alpine
DOCKER_API := docker run --rm -v ${PWD}:/jobboard -u=${CURRENT_UID} -w /jobboard/apps/api node:12.14-alpine
DC_DEV := docker-compose -p cc-jobboard-dev
DC_TEST := docker-compose -p cc-jobboard-test -f docker-compose-test.yml

help: ## Display available commands
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =====================================================================
# Initialization ======================================================
# =====================================================================

install: ## Install all js deps
	@cp -n ./config/development.dist ./config/development.env
	@${DC_DEV} run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn \
	'
install-cypress: ## Install cypress.io bin on local environment, not in Docker !
	@node_modules/.bin/cypress install

# =====================================================================
# Operating recipies ==================================================
# =====================================================================

start: ## Start all service in containers
	${DC_DEV} up -d

stop: ## Stop all containers
	${DC_DEV} down

logs: ## Display all logs
	${DC_DEV} logs -f

connect-api: ## Start cli in api container
	${DC_DEV} exec api ash

# =====================================================================
# OpenAPI =============================================================
# =====================================================================

openapi: openapi-validate openapi-bundle ## Bundle then validate the OpenAPI schema

openapi-bundle: ## Bundle the OpenAPI schema
	@$(DOCKER_API) yarn openapi:bundle

openapi-validate: ## Validate the OpenAPI schema
	@$(DOCKER_API) yarn openapi:check

# =====================================================================
# ADR - Architecture Decision Records =================================
# =====================================================================

adr-new: ## Create new ADR
	@if [ "$(title)" = "" ]; then \
		echo 'Vous devez déclarer un titre'; \
		echo 'Exemple: make adr-new title="New Team Decision"'; \
		exit 1; \
	fi
	@${DOCKER} yarn adr:new "${title}"

adr-list: ## List all ADR
	@${DOCKER} yarn adr:list

# =====================================================================
# DATABASE ============================================================
# =====================================================================

import-fixed-fixtures: ## Import fixtures from a json file create by hand
	$(DC_DEV) exec api ash -ci 'node cli/load-fixed-fixtures'

migrate-create: ## Create a new migration file, ie make migrate-create name=whatever-title
	$(DC_DEV) exec api ash -ci 'yarn migrate:create -- ${name}'

migrate-latest: ## Apply Migrations up to the last one
	$(DC_DEV) exec api ash -ci 'yarn migrate:latest'

migrate-rollback: ## Apply Migrations down to last state
	$(DC_DEV) exec api ash -ci 'yarn migrate:rollback'

migrate-down: ## Apply Migrations down one step
	$(DC_DEV) exec api ash -ci 'yarn migrate:down'

migrate-up: ## Apply Migrations up one step
	$(DC_DEV) exec api ash -ci 'yarn migrate:up'

migrate-list: ## Apply Migrations list
	$(DC_DEV) exec api ash -ci 'yarn migrate:list'

# =====================================================================
# Testing =============================================================
# =====================================================================

test: test-unit ## launch all tests in docker

test-unit: ## launch only tests unit (front and api)
	@${DC_TEST} run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn test \
	'

test-unit-watch: ## launch only tests unit in watch mode
	@${DC_TEST} run --rm --no-deps api ash -ci '\
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
	@${DC_DEV} run --rm --no-deps front ash -ci '\
		rm -f public/bundle.* && \
		yarn build \
	'

