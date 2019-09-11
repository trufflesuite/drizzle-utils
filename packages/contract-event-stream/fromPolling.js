const { from } = require("rxjs");
const { concatMap, flatMap } = require("rxjs/operators");

const fromPolling = ({ contract, newBlock$ }) => {
  const observable = newBlock$.pipe(
    concatMap(block => {
      const options = {
        fromBlock: block.number,
        toBlock: block.number,
      };
      return from(contract.getPastEvents("allEvents", options));
    }),
    flatMap(arr => from(arr)),
  );

  return observable;
};

module.exports = fromPolling;
