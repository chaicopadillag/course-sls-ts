import { appMiddleware } from '@/libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import aws from 'aws-sdk';

const dynamoDB = new aws.DynamoDB.DocumentClient();

const getAuctionById = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const { id } = event.pathParameters as { id: string };

    if (!id) {
      return {
        statusCode: 422,
        body: JSON.stringify({ message: 'Missing id' })
      };
    }

    const result = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
        Key: { id }
      })
      .promise();

    const auction = result.Item;

    return {
      statusCode: 200,
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

export const handler = appMiddleware(getAuctionById);
