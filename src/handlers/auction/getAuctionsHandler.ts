import { dynamoDB } from '@/db';
import { appBuildResponse, appMiddleware } from '@/libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const getAuctions = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable'
      })
      .promise();

    const auctions = result.Items;

    return appBuildResponse(auctions);
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(getAuctions);
