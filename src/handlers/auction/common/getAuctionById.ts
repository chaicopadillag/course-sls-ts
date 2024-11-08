import { dynamoDB } from '@/db';

export async function getAuctionById(id: string) {
  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
        Key: { id }
      })
      .promise();

    const auction = result.Item;

    return auction;
  } catch (error) {
    return null;
  }
}
