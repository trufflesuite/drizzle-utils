const eventMatcher = {
  address: expect.anything(),
  blockHash: expect.anything(),
  blockNumber: expect.anything(),
  id: expect.anything(),
  logIndex: expect.anything(),
  raw: {
    data: expect.anything(),
    topics: [expect.anything()],
  },
  signature: expect.anything(),
  transactionHash: expect.anything(),
};

module.exports = { eventMatcher };
