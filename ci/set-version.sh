#!/bin/sh -x

tag=`git describe --tags`

if [ $? -eq 0 ]; then
    cd web && npm version $tag
fi
