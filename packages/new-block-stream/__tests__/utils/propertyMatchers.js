const blockMatcher = {
  hash: expect.anything(),
  parentHash: expect.anything(),
  timestamp: expect.anything(),
  stateRoot: expect.anything(),
  transactions: [{ blockHash: expect.anything() }],
  gasUsed: expect.any(Number),
  number: expect.any(Number),
};

module.exports = { blockMatcher };
