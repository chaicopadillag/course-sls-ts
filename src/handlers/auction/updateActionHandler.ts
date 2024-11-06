import { appMiddleware } from '@libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import aws from 'aws-sdk';

const dynamoDB = new aws.DynamoDB.DocumentClient();

const placinBidAuction = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = event.body as any;
    const { id } = event.pathParameters as { id: string };

    if (!id) {
      return {
        statusCode: 422,
        body: JSON.stringify({ message: 'Missing id' })
      };
    }
    const now = new Date();

    const result = await dynamoDB
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
        Key: { id },
        UpdateExpression: 'set highestBid = :highestBid, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':highestBid': { amount: body.amount },
          ':updatedAt': now.toISOString()
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(placinBidAuction);
