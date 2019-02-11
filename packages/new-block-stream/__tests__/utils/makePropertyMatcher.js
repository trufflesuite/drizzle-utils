const makePropertyMatcher = () => ({
  hash: expect.anything(),
  parentHash: expect.anything(),
  timestamp: expect.anything(),
  transactions: [{ blockHash: expect.anything() }],
});

module.exports = makePropertyMatcher;
