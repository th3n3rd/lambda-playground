import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dbClient } from './db-client';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    try {
        const { Items } = await dbClient
            .query({
                TableName: 'PeopleReceived',
                Limit: 1,
                KeyConditionExpression: 'Room = :room',
                ExpressionAttributeValues: { ':room': '1' },
                ScanIndexForward: false,
            })
            .promise();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: Items?.[0].FullName,
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};
