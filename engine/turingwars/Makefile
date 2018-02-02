JAR_VERSION=$(shell cat build.sbt | grep version | cut -d'"' -f 2)
JAR=scala-2.12/turingwars-assembly-$(JAR_VARION).jar

$(JAR):
	sbt assembly

install:
	mkdir -p ${HOME}/.sbt/launchers/0.13.9/
	curl -L -o ${HOME}/.sbt/launchers/0.13.9/sbt-launch.jar http://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.9/sbt-launch.jar


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
