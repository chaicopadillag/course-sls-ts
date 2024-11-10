import { dynamoDB } from '@/db';
import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const sqs = new AWS.SQS({ region: 'us-east-2' });

export async function closeAuction(auction: any) {
  const params: DocumentClient.UpdateItemInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME || 'UnkownTable',
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED'
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  };

  await dynamoDB.update(params).promise();

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL || 'UnkownQueue',
      MessageBody: JSON.stringify({
        subject: 'Auction Closed!',
        recipient: `dev.chaico@gmail.com`,
        body: `Woothoo! Your itm "${auction.title}" has been sold for $${auction.highestBid.amount}`
      })
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL || 'UnkownQueue',
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: 'dev.chaico@gmail.com',
        body: `You won the auction for "${auction.title}" for $${auction.highestBid.amount}`
      })
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
}
