#!/usr/bin/env node
var child_process = require('child_process');
var path = require('path');

child_process.fork(path.join(__dirname, '../lib/server/boot.js'), {
    execArgv: ['-r', 'source-map-support/register'],
    env: {
        'NODE_PATH': appendPath(process.env.NODE_PATH, path.join(__dirname, '../lib')),
        'NODE_ENV': 'production'
    }
});

function appendPath(original, ext) {
    return original ? original + ':' + ext : ext;
}
