module.exports = {
    tables: [
        {
            TableName: 'PeopleReceived',
            KeySchema: [
                { AttributeName: 'Room', KeyType: 'HASH' },
                { AttributeName: 'ReceivedAt', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
                { AttributeName: 'Room', AttributeType: 'S' },
                { AttributeName: 'ReceivedAt', AttributeType: 'S' },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
    ],
};
