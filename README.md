<p align="center">
    <img src="/resources/logos/turingwars.png" width="450" alt="Turing Wars logo"/>
</p>
<p align="center">
    <strong>Turing Wars</strong> — may the core be with you!
</p>


Turing Wars is a multiplayer strategic coding game, inspired by the 1984 classic: [Core War](https://en.wikipedia.org/wiki/Core_War).

In this game, **programs** fight each other in **duels** inside a virtual machine (aka. the **core**). The machine allocates one thread for each program. The goal is to cause the machine to spend as much CPU time mining resources for your side.

There are infinite tactics, including killing the opponent's process, or tricking it into mining for the wrong side!

All programs compete in a world-wide championship, and the best ones show up at the top of the leaderboard.

## Get started

Read [the manual](https://github.com/turingwars/turingwars/wiki/Player-guide) to learn how to play and get started in a breeze.

## Running the game

### Public instance

The easiest way to play the game is to go to a public instance. You can try https://turingwars.hmil.fr , or ping @hmil if the instance is down.

### Using a pre-built release

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

<sup>*</sup>make is found: on linux in the package `build-essentials`, on MacOS it ships with Xcode, on windows good luck.

### How to debug

In VSCode, hit "F5" while the server is running, this will attach a debugger to it. Then set your breakpoints and happy debugging!

## About

The core mechanic of this game was re-discovered independently from Core War. Redcode was used for inspiration in the design of the Turing Wars machine architecture.

Original concept: [Ludovic Barman](https://lbarman.ch), [Hadrien Milano](https://hmil.fr), Nicolas Reich, [Christophe Tafani-Dereeper](https://christophetd.fr)  
Maintainers: Ludovic Barman & Hadrien Milano
