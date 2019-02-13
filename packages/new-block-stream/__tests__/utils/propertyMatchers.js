const blockMatcher = {
  hash: expect.anything(),
  parentHash: expect.anything(),
  timestamp: expect.anything(),
  stateRoot: expect.anything(),
  transactions: [{ blockHash: expect.anything() }],
};

module.exports = { blockMatcher };
