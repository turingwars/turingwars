# TuringWars

<p align="center">
    <img src="/resources/logos/turingwars.png" />
</p>
<p align="center">
    May the core be with you!
</p>


TuringWars is a multiplayer strategic coding game, inspired by the 1984 classic: [Core War](https://en.wikipedia.org/wiki/Core_War).

In this game, you write a **program** which fights other programs in **duels**. All submissions are ranked in a world-wide leaderboard.

## Get started

Read [the manual](https://github.com/turingwars/turingwars/wiki/Player-guide) to learn how to play and get started in a breeze.

## Running the game

### Public instance

The easiest way to play the game is to go to a public instance. You can try https://turingwars.hmil.fr , or ping @hmil if the instance is down.

### From a github release

The second easiest way is to use a pre-built release with Node.JS.

Grab the [latest release](https://github.com/turingwars/turingwars/releases/latest) from GitHub. Copy the link to `turing-wars.tgz` and install it with npm.

For instance, to install version 0.0.4, run
```
npm install -g https://github.com/turingwars/turingwars/releases/download/v0.0.4/turing-wars.tgz
```

Then start the game with:

```
turingwars
```

### From source

To build and run the game from source, you need **a recent** [NodeJS](https://nodejs.org/) (at least 8.11 LTS) and [sbt](https://www.scala-sbt.org/), as well as `make`<sup>*</sup>.

Then just run `make serve` from the root of the repo and you are good to go.

<sup>*</sup> make is found: on linux in the package `build-essentials`, on MacOS it ships with Xcode, on windows good luck.

### How to debug

In VSCode, hit "F5" while the server is running, this will attach a debugger to it. Then set your breakpoints and happy debugging!

## About

The core mechanic of this game was re-discovered independently from Core War. Elements of the latter were then integrated into the design of TuringWars.

Original concept: [Ludovic Barman](https://lbarman.ch), [Hadrien Milano](https://hmil.fr), Nicolas Reich, [Christophe Tafani-Dereeper](https://christophetd.fr)
Maintainers: Ludovic Barman & Hadrien Milano
