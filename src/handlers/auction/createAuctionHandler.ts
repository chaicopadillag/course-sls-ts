import { appMiddleware } from '@libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamoDB = new aws.DynamoDB.DocumentClient();

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

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auction)
    };
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(createAuction);
