const { Subject, from } = require("rxjs");
const { distinctUntilChanged, switchMap } = require("rxjs/operators");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");

const createContractEvent$ = (options = {}) => {
  const { web3, abi, address } = options;
  if (!web3) throw new Error("The options object with web3 is required");
  if (!abi) throw new Error("The options object with contract abi is required");
  if (!address)
    throw new Error("The options object with contract address is required");

  const providerType = web3.currentProvider.constructor.name;

  const contract = new web3.eth.Contract(abi, address);

  // TODO: for subs, return sub so user can unsub
  // Events subscription only works with websocket provider
  if (providerType === "WebsocketProvider") {
    const observable = new Subject();
    contract.events
      .allEvents()
      .on("data", event => {
        observable.next(event);
      })
      .on("error", err => observable.next(err));
    return observable;
  }

  const { observable: newBlock$ } = createNewBlock$({
    web3,
    pollingInterval: 200,
  });

  const observable = newBlock$.pipe(
    switchMap(() => from(contract.getPastEvents("allEvents"))),
    distinctUntilChanged(),
  );

  return observable;
};

module.exports = createContractEvent$;
