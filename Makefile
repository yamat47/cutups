# Every target runs inside the development container (compose.yaml), in application/.
export NODE_VERSION := $(shell cat application/.node-version)
COMPOSE := docker compose
RUN := $(COMPOSE) run --rm

.DEFAULT_GOAL := help
.PHONY: help install dev inbox lookup check test validate build fmt ci extract shell clean

help: ## List the targets
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{ printf "  %-10s %s\n", $$1, $$2 }'

install: ## Build the image and install the dependencies; rerun after a change to package.json or the Dockerfile
	$(RUN) --build app npm ci

dev: ## Start the dev server on http://localhost:4321
	$(RUN) --service-ports app npm run dev

inbox: ## Start the inbox page on http://localhost:4322, to drop a video and its URL
	$(RUN) -p 127.0.0.1:4322:4322 app node scripts/inbox/server.ts

lookup: ## Print what the platform says about a video: make lookup URL=https://...
	$(RUN) app node scripts/inbox/lookup.ts "$(URL)"

check: ## npm run check
	$(RUN) app npm run check

test: ## npm test
	$(RUN) app npm test

validate: ## npm run validate
	$(RUN) app npm run validate

build: ## npm run build
	$(RUN) app npm run build

fmt: ## npm run fmt
	$(RUN) app npm run fmt

ci: ## npm ci, then the steps of .github/workflows/ci.yml, in one container
	$(RUN) app sh -c 'npm ci && npm run ci'

extract: ## Cut the frames and the diagram out of inbox/<name>.mp4: make extract NAME=<name> [AT=<diagram second, default 3>]
	$(RUN) app bash scripts/extract.sh inbox/$(NAME).mp4 $(AT)

shell: ## Open a shell in the container
	$(RUN) app bash

clean: ## Remove the containers and the volumes
	$(COMPOSE) down --volumes
