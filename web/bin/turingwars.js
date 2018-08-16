#!/usr/bin/env node
var child_process = require('child_process');
var path = require('path');


// TODO: This works for prod, but it broke dev...


// child_process.fork(path.join(__dirname, '../lib/server/boot.js'), {
child_process.fork(path.join(__dirname, '../node_modules/.bin/webpack'), ['--config', 'webpack-server.config.js'], {
    env: {
        'NODE_PATH': appendPath(process.env.NODE_PATH, path.join(__dirname, '../lib'))
    }
});

function appendPath(original, ext) {
    return original ? original + ':' + ext : ext;
}
