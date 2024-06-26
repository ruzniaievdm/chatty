TARGET_ENV ?= dev

bootstrap: \
	up \
	migrate \
	load-fixtures

up:
	docker compose up -d --no-deps --remove-orphans

%-run: ## Start specific services.
	docker-compose up -d $$(echo $* | tr + " ")

load-fixtures:
	docker compose run --rm app bash -c "./manage.py loaddata backend/fixtures/users.json \
																														backend/fixtures/conversations.json \
																														backend/fixtures/messages.json"

restart:
	docker-compose restart

stop:
	docker-compose stop

%-stop: ## Stop specific services.
	docker-compose stop $$(echo $* | tr + " ")

down:
	docker-compose down -v

build:
	docker-compose --profile $(TARGET_ENV) build

logs:
	docker-compose logs -f

%-logs: ## View the logs of the specified service container.
	docker-compose logs -f --tail=500 $*

mm:
	docker-compose exec -it app bash -c "python ./manage.py makemigrations"

superuser:
	docker-compose exec -it app bash -c "python ./manage.py createsuperuser --username=root --email=root@example.com"
.PHONY: superuser

migrate:
	docker compose run --rm app python manage.py migrate
	
app-shell:
	docker-compose exec -it app bash

web-shell:
	docker compose run --rm web sh

db-shell:
	docker-compose exec -it db sh

app-attach:
	docker attach chat-app

app-logs:
	docker logs --follow chat-app

db-console:
	docker-compose exec -it db psql -U postgres postgres

app-test:
	docker-compose run --rm app-test bash -c "poetry run pytest"

app-lint:
	docker-compose run --rm app-test bash -c "poetry run pylint backend"

web-test:
	docker-compose run --rm web-test sh -c "npm run test"

test: \
	web-test \
	app-test

ps:
	for i in $$(docker container ls --format "{{.ID}}"); do \
		docker inspect -f '{{.State.Pid}} {{.Name}}' $$i; \
	done
	docker volume inspect django-channels_pgdata
