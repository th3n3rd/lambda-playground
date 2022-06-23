# Lambda Playground

[![Pipeline](https://github.com/th3n3rd/lambda-playground/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/th3n3rd/lambda-playground/actions/workflows/pipeline.yml)

This repository is used as a playground to experiment on building and testing AWS Serverless functions.

The applications use several AWS resources, including Lambda functions, an API Gateway, DynamoDB Tables and an SQS Queue.

These resources are defined in the `template.yaml` file in this project.

## Local Development

Please install and configure the following tools in order to run, deploy and test the applications provided in this repository:

* [Docker](https://docs.docker.com/get-docker/)
* [Node.js v14.x](https://nodejs.org/en/download/releases/)
* [AWS CLI v1.x](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Localstack](https://docs.localstack.cloud/get-started/#installation)
* [SAM CLI Local](https://docs.localstack.cloud/integrations/aws-sam/#aws-sam-cli-for-localstack) (localstack wrapper for SAM CLI)

## Deploy and Test the applications

To build and deploy your application for the first time, run the following in your shell:

```bash
./script/acceptance.sh
```

The script will build the source of your application, then package and deploy your application to Localstack and eventually
run a quick acceptance test to validate it all works as expected.

For subsequent deployments you can run just:

```bash
./script/deploy.sh
```

This script will keep Localstack up as long as the foreground process is still running, once killed it will
teardown everything.
It can be useful when updating the journey tests or to manually test the applications.

Typically the Serverless functions that are available through an API Gateway will be exposed with an URL with the following format:

```
https://$<api-gateway-id>.execute-api.localhost.localstack.cloud:4566/Prod/<serverless-function-api-path>
```

For instance: `"https://duxy6txsxb.execute-api.localhost.localstack.cloud:4566/Prod/last-person-received"`

## Unit and Integration tests

In order to run unit and integration tests in each application, run the following in your shell:

```bash
./scripts/test.sh
```

## Caveats

If the pipelines fails there is a big chance the problem is due to either:

* Tooling update (e.g. Localstack CLI newer version)
* Unexpected slowness triggering timeouts (i.e. build agent gets slow increasing the time needed to run a test)

If the log output provided by GitHub is not enough, it It is recommended to add and enable [this](https://github.com/mxschmitt/action-tmate) step in the pipeline.

Below a simple example that enables an remote terminal via SSH on the build agent, if any of the steps of the pipeline fails.

```shell
name: Lambda Playground Pipeline
on: [push]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      # ... other steps
      - name: Setup debug session
        if: ${{ failure() }}
        uses: mxschmitt/action-tmate@v3
        timeout-minutes: 2
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.
