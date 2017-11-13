# Turing wars web stack

## Quick start

_Prerequisite_: Node.JS, `npm install`

Chose the option depending on what you want to do:

### I just want to run the damn shit
```sh
npm run build:frontend
npm start
```

### I want to code on the server

```sh
`npm start`
# test stuff at localhost:3000/
# change code in src/server
# kill the server
# repeat
```

### I want to code on the frontend

```sh
npm run watch:frontend
# Then run the server as well. The frontend files will be built whenever frontend sources change.
# Change stuff in src/frontend
# The server will watch files, recompile and refresh your browser page
```

### I want to TDD stuff

```sh
# Run tests once
npm test
# Watch files and run tests automatically
npm run test:watch
```
