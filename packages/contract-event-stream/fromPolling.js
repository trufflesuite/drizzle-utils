const { from } = require("rxjs");
const { concatMap } = require("rxjs/operators");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");

const fromPolling = ({ web3, pollingInterval, contract }) => {
  const { observable: newBlock$ } = createNewBlock$({
    web3,
    pollingInterval,
  });

  const observable = newBlock$.pipe(
    // TODO, this returns an array, should just be an object like the ws one
    concatMap(() => from(contract.getPastEvents("allEvents"))),
  );

  return observable;
};

module.exports = fromPolling;
