import { dynamoDB } from '@/db';
import { appBuildResponse, appMiddleware } from '@libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

const createAuction = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = event.body as any;
    const now = new Date();

    const auction = {
      id: uuid(),
      title: body.title,
      status: 'OPEN',
      createdAt: now.toISOString()
    };

    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
        Item: auction
      })
      .promise();

    return appBuildResponse(auction, 201);
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(createAuction);
