NODE_MODULES=node_modules/.makets
SRC=$(shell find src/ -type f -name '*.ts')

.PHONY:all
all: serve

.PHONY: build
build: $(NODE_MODULES)
	npm run build:frontend
	npm run build:backend
	cp -r .tmp/transpiled/src/server .tmp/transpiled/src/shared ./lib/

.PHONY: test
test: $(NODE_MODULES)
	npm run test

.PHONY: install
install: $(NODE_MODULES)
	npm install

.PHONY: serve
serve: $(NODE_MODULES)
	npm start

.PHONY: clean
clean:
	@echo "Nothing to clean"

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)
