import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../app';
import { dbClient } from '../db-client';

describe('App', function () {
    beforeEach(async () => {
        const now = new Date();
        const later = new Date();
        later.setDate(now.getDate() + 1);
        await dbClient
            .put({
                TableName: 'PeopleReceived',
                Item: {
                    Room: '1',
                    ReceivedAt: now.toISOString(),
                    FullName: 'Joe Doe',
                },
            })
            .promise();
        await dbClient
            .put({
                TableName: 'PeopleReceived',
                Item: {
                    Room: '1',
                    ReceivedAt: later.toISOString(),
                    FullName: 'Jane Doe',
                },
            })
            .promise();
    });

    afterEach(async () => {
        await dbClient.delete({
            TableName: 'PeopleReceived',
            Key: {
                Id: '1',
            },
        });
    });

    it('retrieves the last received person', async () => {
        const event: APIGatewayProxyEvent = {
            httpMethod: 'get',
            body: '',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/last-received-person',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/last-received-person',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/last-received-person',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Jane Doe',
            }),
        );
    });
});
