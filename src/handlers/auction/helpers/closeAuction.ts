import { dynamoDB } from '@/db';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export async function closeAuction(id: string) {
  const params: DocumentClient.UpdateItemInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED'
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  };

  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}
