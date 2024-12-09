.PHONY: build-local
build-local: ## Build the local docker image.
	sudo docker compose -f docker/local/docker-compose.yaml build

.PHONY: start-local
start-local: ## Start the local docker container.
	sudo docker compose -f docker/local/docker-compose.yaml up -d

.PHONY: stop-local
stop-local: ## Stop the local docker container.
	sudo docker compose -f docker/local/docker-compose.yaml down

.PHONY: build-production
build-production: ## Build the production docker image.
	sudo docker compose -f docker/production/docker-compose.yaml build

.PHONY: start-production
start-production: ## Start the production docker container.
	sudo docker compose -f docker/production/docker-compose.yaml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	sudo docker compose -f docker/production/docker-compose.yaml down
