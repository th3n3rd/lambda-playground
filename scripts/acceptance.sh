#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
DEPLOY_REGION=eu-west-1

cd "$SCRIPT_DIR/.." || exit

cleanup() {
    # Because of a bug in samlocal (localstack), the aws stack cannot be deleted hence no idempotency
    # Details: https://github.com/localstack/localstack/issues/5949
    localstack stop
}

localstack start -d
trap cleanup EXIT

echo "Building locally"
samlocal build --beta-features

echo "Deploy locally on localstack (as Zip onto S3)"
samlocal deploy --resolve-s3

API_GATEWAY_ID=$(awslocal apigateway get-rest-apis --region $DEPLOY_REGION | jq -r '.items[0].id')

echo "Testing Hello Api"
awslocal dynamodb put-item \
    --region $DEPLOY_REGION \
    --table-name "Audience" \
    --item '{
        "Id": {"S": "1"},
        "Target": {"S": "world"}
      }'

HELLO_API_URL="https://$API_GATEWAY_ID.execute-api.localhost.localstack.cloud:4566/Prod/hello"
HELLO_API_RESP_EXPECTED='{"message":"hello world"}'
HELLO_API_RESP_ACTUAL=$(curl --silent "$HELLO_API_URL")

if [ "$HELLO_API_RESP_ACTUAL" != "$HELLO_API_RESP_EXPECTED" ]; then
    echo "Hello Api acceptance test failed." >&2
    echo "expected: $HELLO_API_RESP_EXPECTED" >&2
    echo "actual: $HELLO_API_RESP_ACTUAL" >&2
    exit 1
fi
echo "Hello Api works as expected"

echo "Testing Reception journey"
echo "Advertise Jane Doe has joined"
QUEUE_URL=$(awslocal sqs list-queues --region $DEPLOY_REGION | jq -r '.QueueUrls[0]')
awslocal sqs send-message --queue-url "$QUEUE_URL" --message-body "Jane Doe" --region $DEPLOY_REGION

echo "Waiting for the message to be processed"
sleep 2

echo "Inspecting the last received person"
RECEPTION_API_URL="https://$API_GATEWAY_ID.execute-api.localhost.localstack.cloud:4566/Prod/last-received-person"
RECEPTION_API_RESP_EXPECTED='{"message":"Jane Doe"}'
RECEPTION_API_RESP_ACTUAL=$(curl --silent "$RECEPTION_API_URL")

if [ "$RECEPTION_API_RESP_ACTUAL" != "$RECEPTION_API_RESP_EXPECTED" ]; then
    echo "Reception Api acceptance test failed." >&2
    echo "expected: $RECEPTION_API_RESP_EXPECTED" >&2
    echo "actual: $RECEPTION_API_RESP_ACTUAL" >&2
    exit 1
fi
echo "Reception journey works as expected"

echo "Acceptance tests passed"
