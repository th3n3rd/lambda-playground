#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
DEPLOY_REGION=eu-west-1

cd "$SCRIPT_DIR/.." || exit

cleanup() {
    # Because of a bug in samlocal (localstack), the aws stack cannot be deleted hence no idempotency
    # Details: https://github.com/localstack/localstack/issues/5949
    echo "Tearing Localstack down"
    localstack stop
}

echo "Setting Localstack up"
localstack start -d
trap cleanup EXIT

echo "Building locally"
samlocal build --beta-features

echo "Deploy locally on localstack (as Zip onto S3)"
samlocal deploy --resolve-s3

echo "Running Acceptance tests"
cd e2e
npm install
npm run test

echo "Acceptance tests passed"
