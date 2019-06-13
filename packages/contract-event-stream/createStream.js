const { from } = require("rxjs");
const { concatMap, flatMap } = require("rxjs/operators");

const createStream = ({ contract, newBlock$ }) => {
  const observable = newBlock$.pipe(
    concatMap(block => {
      const promise = contract.getPastEvents("allEvents", {
        fromBlock: block.number,
        toBlock: block.number,
      });
      return from(promise);
    }),
    flatMap(arrayOfEvents => from(arrayOfEvents)),
  );

  return observable;
};

module.exports = createStream;
