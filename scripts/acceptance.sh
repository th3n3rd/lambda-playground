#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

cd "$SCRIPT_DIR/.." || exit

cleanup() {
    kill $LAMBDA_API_MOCK_PID
}

echo "Building locally"
sam build --beta-features

echo "Deploying locally"
sam local start-api &
LAMBDA_API_MOCK_PID=$!
trap cleanup EXIT
sleep 3
echo "Testing sample lambda function firing an api request"
API_TRIGGERED_EXPECTED='{"message":"hello world"}'
API_TRIGGERED_ACTUAL=$(curl --silent "http://127.0.0.1:3000/hello")
if [ "$API_TRIGGERED_ACTUAL" != "$API_TRIGGERED_EXPECTED" ]; then
    echo "Api acceptance test failed." >&2
    echo "expected: $API_TRIGGERED_EXPECTED" >&2
    echo "actual: $API_TRIGGERED_ACTUAL" >&2
    exit 1
fi

echo "Testing sample lambda function firing an event"
EVENT_TRIGGERED_EXPECTED='{"statusCode":200,"body":"{\"message\":\"hello world\"}"}'
EVENT_TRIGGERED_ACTUAL=$(sam local invoke "HelloWorldFunction" -e events/event.json)
if [ "$EVENT_TRIGGERED_ACTUAL" != "$EVENT_TRIGGERED_EXPECTED" ]; then
    echo "Event acceptance test failed." >&2
    echo "expected: $EVENT_TRIGGERED_EXPECTED" >&2
    echo "actual: $EVENT_TRIGGERED_ACTUAL" >&2
    exit 1
fi

echo "Acceptance test passed"
