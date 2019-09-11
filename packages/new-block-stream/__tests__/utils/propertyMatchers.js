const blockMatcher = {
  hash: expect.anything(),
  parentHash: expect.anything(),
  timestamp: expect.anything(),
  stateRoot: expect.anything(),
  transactions: expect.anything(),
  transactionsRoot: expect.any(String),
  receiptsRoot: expect.any(String),
  gasUsed: expect.any(Number),
  number: expect.any(Number),
};

module.exports = { blockMatcher };
