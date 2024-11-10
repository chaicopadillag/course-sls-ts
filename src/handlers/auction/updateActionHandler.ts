import { dynamoDB } from '@/db';
import { appBuildResponse, appMiddleware } from '@libs';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getAuctionById } from './common';
import { placeBidAuctionSchema } from './schemas';

const placingBidAuction = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body = event.body as any;
    const { id } = event.pathParameters as { id: string };

    if (!id) {
      return appBuildResponse({ message: 'Missing id' }, 422);
    }

    const auction = await getAuctionById(id);

    if (!auction) {
      return appBuildResponse({ message: 'Auction not found' }, 404);
    }

    if (auction.status !== 'OPEN') {
      return appBuildResponse({ message: 'You cannot bid on closed auctions' }, 409);
    }

    if (auction?.highestBid?.amount >= body.amount) {
      return appBuildResponse({ message: `Your bid must be higher than ${auction.highestBid.amount}` }, 409);
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

    return appBuildResponse(result.Attributes);
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(placingBidAuction).use(
  validator({
    eventSchema: transpileSchema(placeBidAuctionSchema, {
      useDefaults: true,
      strict: true
    })
  })
);
