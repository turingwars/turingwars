BIN=target/scala-2.12/turingwars-engine-fastopt.js
SRC=$(shell find src/ -type f -name '*.scala')

.PHONY: all
all: test $(BIN)

$(BIN): $(SRC)
	sbt clean fastOptJS

.PHONY: js
js: $(BIN)

.PHONY: test
test:
	sbt test

.PHONY: clean
clean:
	sbt clean
