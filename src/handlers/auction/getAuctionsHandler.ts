import { appMiddleware } from '@/libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import aws from 'aws-sdk';

const dynamoDB = new aws.DynamoDB.DocumentClient();

const getAuctions = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable'
      })
      .promise();

    const auctions = result.Items;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auctions)
    };
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(getAuctions);
