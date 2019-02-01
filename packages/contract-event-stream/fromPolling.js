const { from } = require("rxjs");
const { concatMap } = require("rxjs/operators");

const fromPolling = ({ contract, newBlock$ }) => {
  const observable = newBlock$.pipe(
    // TODO, this returns an array, should just be an object like the ws one
    // Default getPastEvents only returns latest block, will always be an array of 1
    concatMap(() => from(contract.getPastEvents("allEvents"))),
  );

  return observable;
};

module.exports = fromPolling;
