import { ClientConfiguration as DynamoDbConfig } from 'aws-sdk/clients/dynamodb';

interface Config {
    db: DynamoDbConfig;
}

let dbConfig: DynamoDbConfig = {};

if (process.env.LOCALSTACK_HOSTNAME) {
    dbConfig = {
        ...dbConfig,
        endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:${process.env.EDGE_PORT}`,
    };
}

if (process.env.JEST_WORKER_ID) {
    dbConfig = {
        ...dbConfig,
        endpoint: 'http://localhost:8000',
        region: 'local',
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
    };
}

export default {
    db: dbConfig,
} as Config;
