#!/bin/bash -xe

turingwars &
pid=$!

sleep 1
curl http://localhost:3000/ > /dev/null

kill $pid
