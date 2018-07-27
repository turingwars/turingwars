name := "turingwars"

version := "0.1"

scalaVersion := "2.12.4"

libraryDependencies += "org.scalactic" %% "scalactic" % "3.0.4"
libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.4" % "test"
libraryDependencies += "io.scalajs" %%% "nodejs" % "0.4.2"

val circeVersion = "0.9.3"

libraryDependencies ++= Seq(
  "io.circe" %%% "circe-core",
  "io.circe" %%% "circe-generic",
  "io.circe" %%% "circe-parser"
).map(_ % circeVersion)

enablePlugins(ScalaJSPlugin)

name := "TuringWars engine"
scalaVersion := "2.12.6" // or any other Scala version >= 2.10.2
scalaJSModuleKind := ModuleKind.CommonJSModule
// This is an application with a main method
scalaJSUseMainModuleInitializer := true
