export const placeBidAuctionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'number'
        }
      },
      required: ['amount']
    }
  },
  required: ['body']
};
