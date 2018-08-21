NODE_MODULES=node_modules/.makets
SERVER_SRC=$(shell find src/server -type f -name '*.ts')
SHARED_SRC=$(shell find src/shared -type f -name '*.ts')
FRONTEND_SRC=$(shell find src/frontend -type f -name '*.ts')
SERVER_BIN=lib/server/boot.js
FRONTEND_BIN=public/dist/app.js

ENGINE_BIN=lib/engine.js


.PHONY: all
all: serve

.PHONY: package
package:
	npm pack

.PHONY: build
build: $(ENGINE_BIN)
	$(MAKE) $(SERVER_BIN)
	$(MAKE) $(FRONTEND_BIN)

$(SERVER_BIN): $(NODE_MODULES) $(SERVER_SRC) $(SHARED_SRC) webpack-server.config.js tsconfig.json
	node_modules/.bin/tsc -p . # Transpile everything although we only really care about 'shared' and 'server'
	cp -r .tmp/transpiled/src/server .tmp/transpiled/src/shared ./lib/

$(FRONTEND_BIN): $(NODE_MODULES) $(FRONTEND_SRC) $(SHARED_SRC) webpack.config.js tsconfig.json
	NODE_ENV=production node_modules/.bin/webpack # Build the client files

$(ENGINE_BIN):
	$(MAKE) -C .. web/$(ENGINE_BIN)

.PHONY: test
test: $(NODE_MODULES)
	npm run test

.PHONY: install
install: $(NODE_MODULES)
	npm install

.PHONY: serve
serve: $(NODE_MODULES)
	node_modules/.bin/webpack --config webpack-server.config.js

.PHONY: clean
clean:
	rm -rf .tmp lib/* public/dist

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)
