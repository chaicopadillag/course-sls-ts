import { APIGatewayProxyEvent, Context } from "aws-lambda";
import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamoDB = new aws.DynamoDB.DocumentClient();

export const createAuction = async (event: APIGatewayProxyEvent, context: Context) => {

  const body = JSON.parse(event.body || "{}");


  const auction = {
    id:uuid(),
    title: body.title,
    status: "OPEN",
    endingAt: new Date(),
    createdAt: new Date(),    
    highestBid: {
      amount: 0,
    },  
  };
  console.log({auction})

  await dynamoDB.put({
    TableName: 'AuctionsTable',
    Item: auction,
  }).promise();

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(auction),
  };


};