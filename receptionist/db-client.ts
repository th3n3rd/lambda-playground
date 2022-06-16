import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import config from './config';

export const dbClient = new DocumentClient(config.db);
