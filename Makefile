JS_IN_WEBSERVER=web/lib/engine.js

.PHONY: engine
engine:	
	$(MAKE) -C engine/turingwars js

.PHONY: test
test:
	$(MAKE) -C engine/turingwars test
	$(MAKE) -C web test

.PHONY: serve
serve: $(JS_IN_WEBSERVER)
	$(MAKE) -C web serve

.PHONY: build
build: $(JS_IN_WEBSERVER)
	$(MAKE) -C web package
	mv web/turing-wars*.tgz ./turing-wars.tgz

.PHONY: clean
clean:
	$(MAKE) -C engine/turingwars clean
	$(MAKE) -C web clean

$(JS_IN_WEBSERVER): engine
	rm -f $(JS_IN_WEBSERVER)
	mkdir -p $(dir $(JS_IN_WEBSERVER))
	cp engine/turingwars/target/scala-2.12/turingwars-engine-fastopt.js $(JS_IN_WEBSERVER)