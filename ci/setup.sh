#!/bin/sh -x

mkdir -p ${HOME}/.sbt/launchers/1.0.3/
curl -L -o ${HOME}/.sbt/launchers/1.0.3/sbt-launch.jar http://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.9/sbt-launch.jar
