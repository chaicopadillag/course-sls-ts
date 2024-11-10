import { dynamoDB } from '@/db';
import { appBuildResponse, appMiddleware } from '@libs';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { createAuctionSchema } from './schemas';

const createAuction = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = event.body as any;
    const now = new Date();
    const endDate = new Date();
    const endingAt = new Date(endDate.setHours(now.getHours() + 1));

    const auction = {
      id: uuid(),
      title: body.title,
      status: 'OPEN',
      createdAt: now.toISOString(),
      endingAt: endingAt.toISOString()
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

export const handler = appMiddleware(createAuction).use(
  validator({
    eventSchema: transpileSchema(createAuctionSchema, {
      useDefaults: true,
      strict: true
    })
  })
);
