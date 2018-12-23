/* eslint-disable no-unused-vars, no-console */

const { Subject, from, merge } = require("rxjs");
const { map, distinctUntilChanged, switchMap } = require("rxjs/operators");

// wraps an un-documented API for updates into a stream
const createUpdate$ = web3 => {
  const observable = new Subject();
  web3.currentProvider.publicConfigStore.on("update", data => {
    observable.next(data);
  });
  return observable;
};

const createContractData$ = options =>
  new Promise(async (resolve, reject) => {
    if (!options || !options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }
    const { web3 } = options;
    const providerType = web3.currentProvider.constructor.name;

    if (providerType === "WebsocketProvider") {
      // use web3.eth.subscribe to listen for new blocks
      const observable = new Subject();
      const subscription = web3.eth.subscribe(
        "newBlockHeaders",
        (err, blockHeader) => observable.next(err || blockHeader),
      );

      return resolve({ observable, subscription });
    }

    // TODO - fallback to polling with eth-block-tracker
  });

module.exports = createContractData$;
