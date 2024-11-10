// lambda send mail by aws ses
import { appBuildResponse } from '@/libs';
import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-2' });

const sendMail = async (event: SQSEvent) => {
  const record = event.Records[0];
  console.log('processing record', record);

  const email = JSON.parse(record.body);

  const { subject, body, recipient } = email;

  const params: AWS.SES.SendEmailRequest = {
    Source: 'dev.chaico@gmail.com',
    Destination: {
      ToAddresses: [recipient]
    },
    Message: {
      Body: {
        Html: {
          Data: body
        }
      },
      Subject: { Data: subject }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();

    return appBuildResponse(
      {
        message: `Email sent successfully by AWS SES, ID: ${result.MessageId}`
      },
      200
    );
  } catch (err) {
    return appBuildResponse(
      {
        message: `Error sending email by AWS SES: ${err}`
      },
      500
    );
  }
};

export const handler = sendMail;
