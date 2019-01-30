const { from } = require("rxjs");
const { distinctUntilChanged, switchMap } = require("rxjs/operators");

const createContractCall$ = options => {
  // TODO - check that the user passed newBlock$ and a web3 method call
  const { newBlock$, methodCall } = options;

  // for each new block, we call the method
  const observable = newBlock$.pipe(
    switchMap(() => from(methodCall.call())),
    distinctUntilChanged(),
  );

  return observable;
};

module.exports = createContractCall$;
