const { from } = require("rxjs");
const { distinctUntilChanged, switchMap } = require("rxjs/operators");

const createContractCall$ = (options = {}) => {
  const { newBlock$, methodCall } = options;
  if (!newBlock$)
    throw new Error("The options object with newBlock$ is required");
  if (!methodCall)
    throw new Error("The options object with methodCall is required");

  // for each new block, we call the method
  const observable = newBlock$.pipe(
    switchMap(() => from(methodCall.call())),
    distinctUntilChanged(),
  );

  return observable;
};

module.exports = createContractCall$;
