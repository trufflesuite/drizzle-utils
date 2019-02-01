const { from } = require("rxjs");
const { switchMap } = require("rxjs/operators");
const TruffleDecoder = require("truffle-decoder");

const createContractState$ = options => {
  const { newBlock$, artifact, provider } = options;
  if (!newBlock$)
    throw new Error("The options object with newBlock$ is required");
  if (!artifact)
    throw new Error("The options object with artifact is required");
  if (!provider)
    throw new Error("The options object with provider is required");

  // Setting up decoder instance
  // TODO - support contract inheritance (the 2nd arg)
  const decoder = TruffleDecoder.forContract(artifact, [], provider);
  decoder.init();

  // for each new block, we decode the state
  const observable = newBlock$.pipe(switchMap(() => from(decoder.state())));

  return observable;
};

module.exports = createContractState$;
