const { timer, from } = require("rxjs");
const { distinctUntilChanged, map, concatMap } = require("rxjs/operators");
const { getNonSkippingBlockNum$ } = require("./utils");

const fromPolling = ({ web3, pollingInterval, skipBlocks }) => {
  // create a stream to poll the blockchain at an interval
  const timer$ = timer(0, pollingInterval);

  // a stream of block numbers, which might miss blocks
  const latestBlockNum$ = timer$.pipe(
    concatMap(() => from(web3.eth.getBlock("latest"))),
    map(block => block.number),
    distinctUntilChanged(),
  );

  // decide whether to not miss any blocks or to skip them
  const block$ = skipBlocks
    ? latestBlockNum$
    : getNonSkippingBlockNum$(latestBlockNum$);

  return block$.pipe(concatMap(num => web3.eth.getBlock(num, true)));
};

module.exports = fromPolling;
