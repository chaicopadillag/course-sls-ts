import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { closeAuction, getEndedActions } from './helpers';

const processAuctions = async (event: APIGatewayProxyEvent, context: Context) => {
  const auctionsToClose = await getEndedActions();

  const closePromises = auctionsToClose.map((auction) => closeAuction(auction.id));

  await Promise.all(closePromises);

  return { closed: closePromises.length };
};

export const handler = processAuctions;
