JAR_VERSION=$(shell cat build.sbt | grep version | cut -d'"' -f 2)
JAR=scala-2.12/turingwars-assembly-$(JAR_VARION).jar

$(JAR):
	sbt assembly

install:

.PHONY: jar
jar: $(JAR)

.PHONY: test
test:
	sbt test

.PHONY: clean
clean:
	sbt clean

.PHONY:all
all: $(JAR)
