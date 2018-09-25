#!/bin/sh -x

tag=`git describe --tags`

if ! echo $tag | grep -q 'untagged'; then
    cd web && npm version $tag
fi
