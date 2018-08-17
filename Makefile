JS_IN_WEBSERVER=web/lib/turingwars.js

.PHONY: engine
engine:	
	$(MAKE) -C engine/turingwars js

$(JS_IN_WEBSERVER): engine
	rm -f $(JS_IN_WEBSERVER)
	cp engine/turingwars/target/scala-2.12/turingwars-engine-fastopt.js $(JS_IN_WEBSERVER)

copy-jar: $(JS_IN_WEBSERVER)

.PHONY: test
test:
	$(MAKE) -C engine/turingwars test
	$(MAKE) -C web test

.PHONY: install-travis
install-travis:
	$(MAKE) -C engine/turingwars install-travis
	$(MAKE) -C web install

.PHONY: serve
serve: $(JS_IN_WEBSERVER)
	$(MAKE) -C web serve

.PHONY: clean
clean:
	$(MAKE) -C engine/turingwars clean
	$(MAKE) -C web clean

.PHONY:all
all: engine