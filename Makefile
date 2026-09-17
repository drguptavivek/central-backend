default: base

SHELL := /usr/bin/env bash

NODE_CONFIG_ENV ?= test
export PGAPPNAME ?= odkcentral

node_modules: package.json
	npm install
	touch node_modules

.PHONY: node_version
node_version: node_modules
	node lib/bin/enforce-node-version.js


################################################################################
# OIDC

.PHONY: test-oidc-integration
test-oidc-integration: node_version
	TEST_AUTH=oidc NODE_CONFIG_ENV=oidc-integration-test make test-integration

.PHONY: dev-oidc
dev-oidc: base
	NODE_CONFIG_ENV=oidc-development npx nodemon --watch lib --watch config lib/bin/run-server.js

.PHONY: fake-oidc-server
fake-oidc-server:
	cd test/e2e/oidc/fake-oidc-server && \
	FAKE_OIDC_ROOT_URL=http://localhost:9898 npx nodemon index.mjs

.PHONY: fake-oidc-server-ci
fake-oidc-server-ci:
	cd test/e2e/oidc/fake-oidc-server && \
	node index.mjs


################################################################################
# S3

.PHONY: fake-s3-accounts
fake-s3-accounts: node_version
	NODE_CONFIG_ENV=s3-dev node lib/bin/s3-create-bucket.js

.PHONY: dev-s3
dev-s3: fake-s3-accounts base
	NODE_CONFIG_ENV=s3-dev npx nodemon --watch lib --watch config lib/bin/run-server.js

# Garage is used as the CI/development S3-compatible service.  Keep the image
# pinned by digest so an emulator upgrade is an explicit, reviewable change.
# The S3 E2E suite still exercises large attachment content integrity through
# the S3 API.  Provider-specific SSE/KMS behavior is not part of this suite.
S3_GARAGE_IMAGE := dxflrs/garage:v2.4.1@sha256:9c96caa2612d3411acc5b0e6701fb238dbfba33e533a6d7d3d811a4b12d0d020
S3_GARAGE_CONTAINER := odk-central-s3-garage
S3_GARAGE_CONFIG := $(CURDIR)/test/e2e/s3/garage.toml
S3_GARAGE_ACCESS_KEY := GKe2e000000000000000000000
S3_GARAGE_SECRET_KEY := 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
S3_GARAGE_BUCKET := odk-central-e2e
S3_SERVER_ARGS := --name $(S3_GARAGE_CONTAINER) \
		--publish 127.0.0.1:9000:3900 \
		--mount type=bind,src=$(S3_GARAGE_CONFIG),dst=/etc/garage.toml,readonly \
		--tmpfs /var/lib/garage:rw,noexec,nosuid,size=2g \
		--env GARAGE_DEFAULT_ACCESS_KEY=$(S3_GARAGE_ACCESS_KEY) \
		--env GARAGE_DEFAULT_SECRET_KEY=$(S3_GARAGE_SECRET_KEY) \
		--env GARAGE_DEFAULT_BUCKET=$(S3_GARAGE_BUCKET)
.PHONY: fake-s3-server-ephemeral
fake-s3-server-ephemeral:
	docker run --rm $(S3_SERVER_ARGS) $(S3_GARAGE_IMAGE) /garage server --single-node --default-bucket
.PHONY: fake-s3-server-persistent
fake-s3-server-persistent:
	docker rm --force $(S3_GARAGE_CONTAINER) >/dev/null 2>&1 || true
	docker run --detach $(S3_SERVER_ARGS) $(S3_GARAGE_IMAGE) /garage server --single-node --default-bucket


################################################################################
# DATABASE MIGRATIONS

.PHONY: migrations
migrations: node_version
	node lib/bin/run-migrations.js


################################################################################
# RUN SERVER

.PHONY: base
base: node_modules node_version migrations

.PHONY: dev
dev: base
	npx nodemon --watch lib --watch config lib/bin/run-server.js

.PHONY: run
run: base
	node lib/bin/run-server.js

.PHONY: debug
debug: base
	node --debug --inspect lib/bin/run-server.js


################################################################################
# TEST & LINT

.PHONY: test
test: lint
	$(MAKE) test-unit
	$(MAKE) test-integration

.PHONY: test-db-migrations
test-db-migrations:
	NODE_CONFIG_ENV=db-migration-test npx mocha --bail --sort --timeout=20000 \
	    --require test/db-migrations/mocha-setup.js \
	    ./test/db-migrations/**/*.spec.js

.PHONY: test-db-ssl
test-db-ssl:
	NODE_CONFIG_ENV=db-migration-test npx mocha --sort --timeout=20000 \
	    --require test/db-ssl/mocha-setup.js \
	    ./test/db-ssl/**/*.spec.js

.PHONY: test-fast
test-fast: node_version
	MOCHA_OPTIONS="--fgrep @slow --invert" $(MAKE) test-unit
	MOCHA_OPTIONS="--fgrep @slow --invert" $(MAKE) test-integration

.PHONY: test-integration
test-integration: node_version
	NODE_CONFIG_ENV=$(NODE_CONFIG_ENV) BCRYPT=insecure npx mocha --recursive \
	    --require test/vg/mocha-expected-failures.js test/integration

.PHONY: test-integration-vg-sessions
test-integration-vg-sessions: node_version
	NODE_CONFIG_ENV=$(NODE_CONFIG_ENV) BCRYPT=insecure npx mocha --timeout=10000 \
	    --require test/vg/mocha-expected-failures.js test/integration/api/sessions.js

.PHONY: test-unit
test-unit: node_version
	NODE_CONFIG_ENV=test BCRYPT=insecure npx mocha --recursive test/unit

.PHONY: test-coverage
test-coverage: node_version
	NODE_CONFIG_ENV=test npx nyc -x "**/migrations/**" --reporter=lcov node_modules/.bin/_mocha --recursive test

.PHONY: lint
lint: node_version
	ESLINT_USE_FLAT_CONFIG=false \
	npx eslint --cache --max-warnings 0 . \
	2> >(grep -Ev 'ESLintRCWarning|--trace-warnings' >&2) # filter eslintrc deprecation warning


################################################################################
# POSTGRES

.PHONY: run-docker-postgres
run-docker-postgres: stop-docker-postgres
	test/bin/docker-postgres.sh start

.PHONY: run-docker-postgres-ssl
run-docker-postgres-ssl: stop-docker-postgres-ssl
	test/bin/docker-postgres.sh --ssl start

.PHONY: stop-docker-postgres
stop-docker-postgres:
	test/bin/docker-postgres.sh stop

.PHONY: stop-docker-postgres-ssl
stop-docker-postgres-ssl:
	test/bin/docker-postgres.sh --ssl stop

.PHONY: rm-docker-postgres
rm-docker-postgres: stop-docker-postgres
	test/bin/docker-postgres.sh remove

.PHONY: rm-docker-postgres-ssl
rm-docker-postgres-ssl: stop-docker-postgres-ssl
	test/bin/docker-postgres.sh --ssl remove


################################################################################
# OTHER

.PHONY: check-for-large-files
check-for-large-files:
	./test/check-for-large-files.sh

.PHONY: api-docs
api-docs:
	(test "$(docker images -q odk-docs)" || docker build --file odk-docs.dockerfile -t odk-docs .) && \
	docker run --rm -it -v ./docs:/docs/docs/_static/central-spec -p 127.0.0.1:8000:8000 odk-docs

.PHONY: api-docs-lint
api-docs-lint:
	node lib/bin/openapi-docs-lint.js docs/api.yaml && \
	npx --no @redocly/cli lint --config docs/redocly.conf.yaml docs/api.yaml
