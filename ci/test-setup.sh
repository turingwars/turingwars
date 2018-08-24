#!/bin/bash -e

logfile=./test.log

cleanup() {
    ret=$?
    set +e

    if [ $ret -ne 0 ] && [ -f $logfile ]; then
        cat $logfile
    fi
    rm -f $logfile
    kill $pid 2>/dev/null
}
is_dead() {
    ! kill -0 $pid
}
trap cleanup EXIT
pid=-1

# main():

echo "Testing the version to be published"

tag=`git describe --tags`
version=`turingwars --version`
if ! echo $tag | grep -q 'untagged' && [ "$version" != "$tag" ]; then
    echo "Did not return the right version:"
    echo "$version"
    exit 1
fi

echo "Starting the server..."

turingwars > $logfile &
pid=$!

# $pid is now the pid of the launcher, which is different from that of the server.
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

echo "Testing connectivity with the server..."

curl http://localhost:3000/ > /dev/null

echo "All good!"
