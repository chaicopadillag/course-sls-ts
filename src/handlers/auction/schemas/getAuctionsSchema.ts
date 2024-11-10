export const getAuctionsSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN'
        }
      },
      required: ['status']
    }
  },
  required: ['queryStringParameters']
};
