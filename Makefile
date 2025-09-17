SHELL=/bin/bash

current_date=$(shell date +%F)
export current_date

SED=$(shell which sed)

ifeq ($(OS),Darwin)
    detected_OS := Darwin
else
    detected_OS := $(shell uname)
endif

COMPOSE := $(shell docker-compose -v 2> /dev/null)
ifndef COMPOSE
	DCOMPCMD=docker compose
else
	DCOMPCMD=docker-compose
endif

up-project:
	@echo "Starting project dependencies"
	@cd common; $(DCOMPCMD) up -d --build

down-project:
	@echo "Stopping and Removing project dependencies"
	@cd common; $(DCOMPCMD) down -v

	@echo "Removing volumes from docker"
	@docker volume ls -f dangling=true
	@docker volume prune -a -f

stop-project:
	@echo "Stopping project dependencies"
	@cd common; $(DCOMPCMD) stop