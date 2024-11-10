import { dynamoDB } from '@/db';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const getEndedActions = async () => {
  const now = new Date();

  const params: DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString()
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  };
  const auctions = await dynamoDB.query(params).promise();

  return auctions.Items || [];
};
