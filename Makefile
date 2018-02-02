JAR_IN_WEBSERVER=web/jar/turingwars.jar

.PHONY: engine
engine:	
	$(MAKE) -C engine/turingwars jar

$(JAR_IN_WEBSERVER): engine
	rm -f web/jar/turingwars.jar
	cp engine/turingwars/target/scala-2.12/*.jar web/jar/turingwars.jar

copy-jar: $(JAR_IN_WEBSERVER)

.PHONY: test
test:
	$(MAKE) -C engine/turingwars test
	$(MAKE) -C web test

.PHONY: install-travis
install-travis:
	$(MAKE) -C engine/turingwars install-travis
	$(MAKE) -C web install

.PHONY: serve
serve: $(JAR_IN_WEBSERVER)
	$(MAKE) -C web serve

.PHONY: clean
clean:
	$(MAKE) -C engine/turingwars clean

.PHONY:all
all: engine