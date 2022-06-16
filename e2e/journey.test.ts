import { APIGateway, SQS } from 'aws-sdk';
import fetch from 'node-fetch';

const localstackEndpoint = 'http://localhost:4566';
const region = 'eu-west-1';

const apiGateway = new APIGateway({
    endpoint: localstackEndpoint,
    region: region,
});

const sqs = new SQS({
    endpoint: localstackEndpoint,
    region: region,
});

const testTimeout = 10 * 1000;

describe('Reception', () => {
    it(
        'tracks people that joins a room',
        async () => {
            await aPersonJoins('Jon Doe');
            await waitForProcessing(2);
            await expectLastReceivedPerson('Jon Doe');

            await aPersonJoins('Jane Doe');
            await waitForProcessing(2);
            await expectLastReceivedPerson('Jane Doe');
        },
        testTimeout,
    );

    async function aPersonJoins(fullName: string) {
        const fetchQueueUrl = await sqs
            .getQueueUrl({
                QueueName: 'PersonJoined',
            })
            .promise();

        await sqs
            .sendMessage({
                QueueUrl: fetchQueueUrl.QueueUrl,
                MessageBody: fullName,
            })
            .promise();
    }

    async function expectLastReceivedPerson(fullName: string) {
        const restApis = await apiGateway.getRestApis().promise();
        const apiGatewayId = restApis.items[0]?.id;
        const response = await fetch(
            `https://${apiGatewayId}.execute-api.localhost.localstack.cloud:4566/Prod/last-received-person`,
        );
        expect(await response.json()).toEqual({
            message: fullName,
        });
    }

    async function waitForProcessing(seconds: number) {
        await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
});
