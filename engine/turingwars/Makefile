BIN=scala-2.12/turingwars-engine-fastopt.js

$(BIN):
	sbt fastOptJS

.PHONY: install-travis
install-travis:
	mkdir -p ${HOME}/.sbt/launchers/1.0.3/
	curl -L -o ${HOME}/.sbt/launchers/1.0.3/sbt-launch.jar http://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.9/sbt-launch.jar

.PHONY: js
js: $(BIN)

.PHONY: test
test:
	sbt test

.PHONY: clean
clean:
	sbt clean

.PHONY:all
all: $(BIN)
