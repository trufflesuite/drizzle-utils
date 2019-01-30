const { from } = require("rxjs");
const { switchMap } = require("rxjs/operators");
const TruffleDecoder = require("truffle-decoder");

const createContractState$ = options => {
  // TODO - check that the user passed newBlock$, artifact, provider
  const { newBlock$, artifact, provider } = options;

  // Setting up decoder instance
  // TODO - support contract inheritance (the 2nd arg)
  const decoder = TruffleDecoder.forContract(artifact, [], provider);
  decoder.init();

  // for each new block, we decode the state
  const observable = newBlock$.pipe(switchMap(() => from(decoder.state())));

  return observable;
};

module.exports = createContractState$;
