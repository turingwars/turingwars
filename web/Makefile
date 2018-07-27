NODE_MODULES=node_modules/.makets
FRONTEND=public/dist/index.js
SRC=$(shell find src/ -type f -name '*.ts')

.PHONY:all
all: serve

.PHONY: test
test: $(NODE_MODULES)
	npm run test

.PHONY: install
install: $(NODE_MODULES)
	npm install

.PHONY: serve
serve: $(NODE_MODULES) views $(FRONTEND)
	npm start

.PHONY: views
views: $(SRC)
	npm run build:views

$(FRONTEND): $(SRC)
	npm run build:frontend

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)
