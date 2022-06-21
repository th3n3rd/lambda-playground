# Lambda Playground

This repository is used as a playground to experiment on building and testing AWS Serverless functions.

The applications use several AWS resources, including Lambda functions, an API Gateway API, DynamoDB Tables and an SQS Queue.

These resources are defined in the `template.yaml` file in this project.

## Local Development

Please install and configure the following tools in order to run, deploy and test the applications provided in this repository:

* [Docker](https://docs.docker.com/get-docker/)
* [Node.js v14.x](https://nodejs.org/en/download/releases/)
* [AWS CLI v1.x](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Localstack](https://docs.localstack.cloud/get-started/#installation)
* [AWS CLI Local](https://docs.localstack.cloud/integrations/aws-cli/#aws-cli) (localstack wrapper for AWS CLI)
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

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.
