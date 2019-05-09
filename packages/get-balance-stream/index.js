const { from } = require("rxjs");
const { distinctUntilChanged, switchMap } = require("rxjs/operators");

const createBalanceStream$ = (options = {}) => {
  const { newBlock$, web3, address } = options;
  if (!web3) {
    throw new Error("The options object with web3 is required.");
  }
  if (!newBlock$)
    throw new Error("The options object with newBlock$ is required");
  if (!address) throw new Error("The options object with address is required");

  // for each new block, we call the method
  const observable = newBlock$.pipe(
    switchMap(() => from(web3.eth.getBalance(address))),
    distinctUntilChanged(),
  );

  return observable;
};

module.exports = createBalanceStream$;
