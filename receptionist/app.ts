import { SQSEvent } from 'aws-lambda';
import { dbClient } from './db-client';

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
    try {
        await dbClient
            .put({
                TableName: 'PeopleReceived',
                Item: {
                    Room: '1',
                    ReceivedAt: new Date().toISOString(),
                    FullName: event.Records[0].body,
                },
            })
            .promise();
    } catch (err) {
        console.log(err);
        throw err;
    }
};
