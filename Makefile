mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(dir $(mkfile_path))

WEB_DIR=$(current_dir)/web
ENGINE_DIR=$(current_dir)/engine

JS_IN_WEBSERVER=$(WEB_DIR)/lib/engine.js
DTS_IN_WEBSERVER=$(WEB_DIR)/lib/engine.d.ts

.PHONY: all
all: test build

.PHONY: engine
engine:	
	$(MAKE) -C $(ENGINE_DIR)/turingwars js

.PHONY: test
test:
	$(MAKE) -C $(ENGINE_DIR)/turingwars test
	$(MAKE) -C $(WEB_DIR) test

.PHONY: serve
serve: publish-engine-to-web
	$(MAKE) -C $(WEB_DIR) serve

.PHONY: build
build: publish-engine-to-web
	$(MAKE) -C $(WEB_DIR) package
	echo "MOVING $(WEB_DIR) to $(current_dir)"
	mv $(WEB_DIR)/turing-wars*.tgz $(current_dir)/turing-wars.tgz

.PHONY: clean
clean:
	$(MAKE) -C $(ENGINE_DIR)/turingwars clean
	$(MAKE) -C $(WEB_DIR) clean
	rm -f turing-wars.tgz

$(JS_IN_WEBSERVER): engine
	rm -f $(JS_IN_WEBSERVER)
	mkdir -p $(dir $(JS_IN_WEBSERVER))
	cp $(ENGINE_DIR)/turingwars/target/scala-2.12/turingwars-engine-fastopt.js $(JS_IN_WEBSERVER)

$(DTS_IN_WEBSERVER): $(ENGINE_DIR)/turingwars/engine.d.ts
	mkdir -p $(dir $(DTS_IN_WEBSERVER))
	cp $(ENGINE_DIR)/turingwars/engine.d.ts $(DTS_IN_WEBSERVER)

.PHONY: publish-engine-to-web
publish-engine-to-web: $(DTS_IN_WEBSERVER) $(JS_IN_WEBSERVER)