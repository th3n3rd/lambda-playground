module.exports = {
    tables: [
        {
            TableName: 'Audience',
            KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
            AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
    ],
};
