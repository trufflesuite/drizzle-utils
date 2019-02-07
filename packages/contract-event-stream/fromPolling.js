const { from } = require("rxjs");
const { concatMap, flatMap } = require("rxjs/operators");

const fromPolling = ({ contract, newBlock$ }) => {
  const observable = newBlock$.pipe(
    concatMap(() => from(contract.getPastEvents("allEvents"))),
    flatMap(arr => from(arr)),
  );

  return observable;
};

module.exports = fromPolling;
