.PHONY: install start stop log

export UID = $(shell id -u)
export GID = $(shell id -g)

export NODE_ENV ?= development

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
# Testing =============================================================
# =====================================================================

DC_TEST = docker-compose -p cc-jobboard-test -f docker-compose-test.yml

test: ## launch all tests in docker
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn test \
	'

test-watch: ## launch all tests in docker
	@docker-compose run --rm --no-deps api ash -ci '\
		cd ../../ && \
		yarn test:watch \
	'
test-e2e: ## Run whole e2e tests suite
	@${MAKE} --quiet test-env-start
	@($(MAKE) --quiet test-env-run && $(MAKE) --quiet test-env-stop) || ($(MAKE) --quiet test-env-stop && exit 1)

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

# =====================================================================
# Build ===============================================================
# =====================================================================

build-front: ## Build the front
	@docker-compose run --rm --no-deps front ash -ci '\
		rm -f public/bundle.* && \
		yarn build \
	'
