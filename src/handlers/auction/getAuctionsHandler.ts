import { dynamoDB } from '@/db';
import { appBuildResponse, appMiddleware } from '@/libs';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getAuctionsSchema } from './schemas';

const getAuctions = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const { status = 'OPEN' } = event.queryStringParameters as { status: string };

    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
      IndexName: 'statusAndEndingAt',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeValues: {
        ':status': status
      },
      ExpressionAttributeNames: {
        '#status': 'status'
      }
    };

    const result = await dynamoDB.query(params).promise();

    const auctions = result.Items;

    return appBuildResponse(auctions);
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(getAuctions).use(
  validator({
    eventSchema: transpileSchema(getAuctionsSchema, {
      useDefaults: true,
      strict: true
    })
  })
);
