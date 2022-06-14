#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

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

echo "Setting up test data"
awslocal dynamodb put-item \
    --region eu-west-1 \
    --table-name "Audience" \
    --item '{
        "Id": {"S": "1"},
        "Target": {"S": "world"}
      }'

LAMBDA_API_ID=$(awslocal apigateway get-rest-apis --region eu-west-1 | jq -r '.items[0].id')
LAMBDA_API_URL="https://$LAMBDA_API_ID.execute-api.localhost.localstack.cloud:4566/Prod/hello"

echo "Testing sample lambda function firing an api request"
API_TRIGGERED_EXPECTED='{"message":"hello world"}'
API_TRIGGERED_ACTUAL=$(curl --silent "$LAMBDA_API_URL")
if [ "$API_TRIGGERED_ACTUAL" != "$API_TRIGGERED_EXPECTED" ]; then
    echo "Api acceptance test failed." >&2
    echo "expected: $API_TRIGGERED_EXPECTED" >&2
    echo "actual: $API_TRIGGERED_ACTUAL" >&2
    exit 1
fi

echo "Acceptance test passed"
