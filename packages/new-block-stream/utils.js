const { from, of } = require("rxjs");
const { concatMap, startWith, pairwise } = require("rxjs/operators");

// helper function to create an array from [x..y]
const range = (min, max) => {
  const len = max - min + 1;
  const arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
};

const getNonSkippingBlockNum$ = latestBlockNum$ => {
  return latestBlockNum$.pipe(
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
};

module.exports = { getNonSkippingBlockNum$ };
