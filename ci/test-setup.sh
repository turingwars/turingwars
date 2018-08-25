#!/bin/bash -e

logfile=./test.log

cleanup() {
    ret=$?
    set +e

    if [ $ret -ne 0 ] && [ -f $logfile ]; then
        cat $logfile
    fi
    rm -f $logfile
    cd infra && ./stop.sh
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
    echo "was '$version' but expected '$tag'."
    exit 1
fi

echo "Starting the server..."

pushd infra
    ./start.sh --source .. --abort-on-container-exit > ../$logfile &
    pid=$!
popd

# Wait until server is either running or dead
until is_dead || grep -q "Server is listening" "$logfile"; do
    sleep 1
done

echo "Testing connectivity with the server..."

curl http://localhost:3000/ > /dev/null

echo "All good!"
