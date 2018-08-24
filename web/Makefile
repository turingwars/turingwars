NODE_MODULES=node_modules/.makets
SERVER_SRC=$(shell find src/server -type f -name '*.ts' -or -name '*.tsx')
SHARED_SRC=$(shell find src/shared -type f -name '*.ts' -or -name '*.tsx')
FRONTEND_SRC=$(shell find src/frontend -type f -name '*.ts' -or -name '*.tsx')
SERVER_BIN=lib/server/boot.js
FRONTEND_BIN=public/dist/app.js

ENGINE_BIN=lib/engine.js

libs.react.dev := react/umd/react.development.js
libs.react.prod := react/umd/react.production.min.js
libs.react-dom.dev := react-dom/umd/react-dom.development.js
libs.react-dom.prod := react-dom/umd/react-dom.production.min.js
libs.react-redux.dev := react-redux/dist/react-redux.js
libs.react-redux.prod := react-redux/dist/react-redux.min.js
libs.redux.dev := redux/dist/redux.js
libs.redux.prod := redux/dist/redux.min.js
libs.axios.dev := axios/dist/axios.js
libs.axios.prod := axios/dist/axios.min.js
libs.codemirror.dev := codemirror/lib/codemirror.js
libs.codemirror.prod := codemirror/lib/codemirror.js

LIBS += react react-dom react-redux redux axios codemirror

LIBS_TYPE=dev

LIBS_OUTPUT=$(patsubst %,public/dist/vendor/%.js,$(notdir $(LIBS)))

.PHONY: all
all: serve

.PHONY: package
package: build
	npm pack

.PHONY: build
build: LIBS_TYPE:=prod
build: $(ENGINE_BIN) $(LIBS_OUTPUT) lib
	$(MAKE) $(SERVER_BIN)
	$(MAKE) $(FRONTEND_BIN)

lib:
	mkdir -p lib

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
serve: $(NODE_MODULES) $(LIBS_OUTPUT)
	node_modules/.bin/webpack --config webpack-server.config.js

.PHONY: clean
clean:
	rm -rf .tmp lib/* public/dist

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)

$(LIBS_OUTPUT): public/dist/vendor/%.js : $(NODE_MODULES)
	mkdir -p $(dir $@)
	cp node_modules/$(libs.$*.$(LIBS_TYPE)) $@