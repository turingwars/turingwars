#!/bin/bash -xe

logfile=./test.log

cleanup() {
    kill $pid
    rm $logfile
}
is_dead() {
    ! kill -0 $pid
}
trap cleanup EXIT


# main():

turingwars | tee $logfile &
pid=$!

# $pid is now the pid of the launcher, which is different from that of the server.
# We now attempt to find the pid of the server.
sleep 1
until is_dead || grep -q "TuringWars started with pid" "$logfile"; do
    sleep 1
done
pid=$(grep "TuringWars started with pid" "$logfile" | sed 's/TuringWars started with pid \([0-9][0-9]*\)./\1/')
echo "Got pid $pid"

# Wait until server is either running or dead
until is_dead || grep -q "Server is listening" "$logfile"; do
    sleep 1
done

curl http://localhost:3000/ > /dev/null
