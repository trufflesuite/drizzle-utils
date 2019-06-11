const { timer, from, of } = require("rxjs");
const {
  distinctUntilChanged,
  map,
  concatMap,
  startWith,
  pairwise,
} = require("rxjs/operators");

// helper function to create an array from [x..y]
const range = (min, max) => {
  const len = max - min + 1;
  const arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
};

const fromPolling = ({ web3, pollingInterval }) => {
  // create a stream to poll the blockchain at an interval
  const timer$ = timer(0, pollingInterval);

  // a stream of block numbers, which might miss blocks
  const latestBlockNum$ = timer$.pipe(
    concatMap(() => from(web3.eth.getBlock("latest"))),
    map(block => block.number),
    distinctUntilChanged(),
  );

  // a stream of block numbers that do not miss any blocks
  const nonSkippingBlockNum$ = latestBlockNum$.pipe(
    startWith(null),
    pairwise(),
    concatMap(([last, curr]) => {
      const isFirstEvent = last === null;
      const blockSkipped = curr - last > 1;

      if (isFirstEvent || !blockSkipped) {
        return of(curr);
      }

      // fill out block numbers for missing blocks
      const blockNumArray = range(last + 1, curr);
      return from(blockNumArray);
    }),
  );

  const observable = nonSkippingBlockNum$.pipe(
    concatMap(num => web3.eth.getBlock(num, true)),
  );

  return observable;
};

module.exports = fromPolling;
