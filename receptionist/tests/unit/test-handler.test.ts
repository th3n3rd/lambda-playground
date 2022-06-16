import { SQSEvent } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { dbClient } from '../../db-client';

describe('Lambda handler', function () {
    it('persists a new record when a person joins', async () => {
        const event: SQSEvent = {
            Records: [
                {
                    messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
                    receiptHandle: 'MessageReceiptHandle',
                    body: 'Jon Doe',
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: '1523232000000',
                        SenderId: '123456789012',
                        ApproximateFirstReceiveTimestamp: '1523232000001',
                    },
                    messageAttributes: {},
                    md5OfBody: '7b270e59b47ff90a553787216d55d91d',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:eu-west-1:123456789012:Messages',
                    awsRegion: 'eu-west-1',
                },
            ],
        };

        await lambdaHandler(event);

        const { Items } = await dbClient
            .query({
                TableName: 'PeopleReceived',
                Limit: 1,
                KeyConditionExpression: 'Room = :room',
                ExpressionAttributeValues: { ':room': '1' },
                ScanIndexForward: false,
            })
            .promise();

        expect(Items.length).toBe(1);
        expect(Items[0].FullName).toEqual('Jon Doe');
    });
});
