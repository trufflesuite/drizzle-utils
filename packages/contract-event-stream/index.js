const { Subject } = require("rxjs");

const createContractEvent$ = options => {
  const { web3Contract } = options;
  if (!web3Contract)
    throw new Error("The options object with web3Contract is required");

  const observable = new Subject();

  // TODO: change api, should be good for both http and ws providers
  // TODO: for subs, return sub so user can unsub

  // Events subscription only works with websocket provider
  web3Contract.events
    .allEvents()
    .on("data", event => {
      observable.next(event);
    })
    .on("error", err => observable.next(err));

  return observable;
};

module.exports = createContractEvent$;
