# TuringWars

[![Build Status](https://travis-ci.org/turingwars/turingwars.svg?branch=master)](https://travis-ci.org/turingwars/turingwars)

![TuringWars](/resources/logos/turingwars.png)

TuringWars is a game where you create **programs** that fight together to **death**!

You create simple programs in assembly (two lines of code are enough).

Then, we spawn two programs in a shared space (a Turing machine), and execute them turn by turn.

The goal is to generate more **resources** than the opponent ! Think of bitcoin miners; those program have access to a special assembly instruction `MINE` that generates resources. But beware of others programs ! Will you greedily mine, or try to anticipate and react to what your opponent is doing ?

![TuringWars](/resources/screenshots/ingame.png)

### Thanks for the pitch. But how does it work ?

The simplest program is the *Miner*.
```asm
mine %id
mov 1 -1
```
His first instruction is *mining* for himself (`%id`), then is second instruction is "move back one instruction".

Hey, that sound efficient! Let's see another simple program that defeats the first one, the *Imp*.
```asm
mov 1 0
```
Twice as efficient, only one instruction! Thing is, he never *mines*, so he never generates point for himself. But he copies the current instruction `mov 1 0` on the next memory slot, and proceed to quickly overwrite the memory with those useless instruction. When it comes where the *Miner* is, he kills it by overwriting the *Miner* program.

### No, that's too dumb. Anything else ?

Sure! a simple but more clever version is the *Dwarf*, so-called because he creates tunnels.
```asm
add b(3) 4
mov b(2) 2
jmp -2
mine %id
```
This one does not mine at first, but hopes to hijack the other's program CPU time! He floods every 4 slots of the memory with `mov` instructions that points to its own `mine` instruction. If it his the memory space corresponding to the opponent program, he will make him jump to the Dwarf's `mine` instruction. Potentially, in the end, both program work for the Dwarf ! 

### I made a killer program !

Awesome, we want to include it in the game. Just open an issue with the code.

## How to run

### Docker setup

(WIP)

### Manual

You only need NodeJS to run the server, java to execute the .jar that simulates the programs, and sbt (which fetches scala) to compile the .jar. Make sure you have at least 10GB of space on your drive for `node_modules`. Just kidding.

Run `make install` in the main folder once to fetch everything. This will download about the whole internet via sbt and node packages.

Then, simply run `make serve` in the main folder to get started.

TODO: instruction on how to develop with watches

## Authors

- [Christophe Tafani-Dereeper](https://christophetd.fr)
- Nicolas Reich
- [Hadrien Milano](https://hmil.fr)
- [Ludovic Barman](https://lbarman.ch)
