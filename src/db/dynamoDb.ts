import aws from 'aws-sdk';

export const dynamoDB = new aws.DynamoDB.DocumentClient();
