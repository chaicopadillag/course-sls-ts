import { appBuildResponse, appMiddleware } from '@/libs';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getAuctionById } from './common';

const getAuctionByIdHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const { id } = event.pathParameters as { id: string };

    if (!id) {
      return appBuildResponse({ message: 'Missing id' }, 422);
    }

    const auction = await getAuctionById(id);

    if (!auction) {
      return appBuildResponse({ message: 'Auction not found' }, 404);
    }

    return appBuildResponse(auction);
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export const handler = appMiddleware(getAuctionByIdHandler);
