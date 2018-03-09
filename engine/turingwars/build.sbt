name := "turingwars"

version := "0.1"

scalaVersion := "2.12.4"
scalacOptions += "-target:jvm-1.8"

libraryDependencies += "io.spray" %%  "spray-json" % "1.3.3"
libraryDependencies += "org.scalactic" %% "scalactic" % "3.0.4"
libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.4" % "test"
libraryDependencies += "com.google.code.gson" % "gson" % "1.7.1"
        