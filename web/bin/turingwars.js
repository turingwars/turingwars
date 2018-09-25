#!/usr/bin/env node
var child_process = require('child_process');
var path = require('path');

if (process.argv.length > 2) {
    const command = process.argv[2];
    if (/-?-v(ersion)?/i.test(command)) {
        console.log(require('../package.json').version);
        process.exit(0);
    }
}

const child = child_process.fork(path.join(__dirname, '../lib/server/boot.js'), process.argv.slice(2), {
    execArgv: ['-r', require.resolve('source-map-support/register')],
    env: {
        'NODE_PATH': appendPath(process.env.NODE_PATH, path.join(__dirname, '../lib')),
        'NODE_ENV': 'production'
    }
});

// Note: This is used by automated test scripts. Be cautions if you change this string.
console.log(`TuringWars started with pid ${child.pid}.`);


function appendPath(original, ext) {
    return original ? original + ':' + ext : ext;
}
