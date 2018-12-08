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

const createCurrentAccount$ = options =>
  new Promise(async (resolve, reject) => {
    if (!options || !options.web3) {
      reject("The options object with web3 is required.");
    }
    const { web3 } = options;

    try {
      // request account access if Metamask is detected
      if (window && window.ethereum) {
        await window.ethereum.enable();
      }

      const initialAccount$ = from(web3.eth.getAccounts()).pipe(map(x => x[0]));
      const newAccount$ = createUpdate$(web3).pipe(map(x => x.selectedAddress));

      // Note: addresses from `newAccount$` are always lowercased, therefore we
      // need to perform a `web3.eth.getAccounts()` call to get the fully check
      // -summed address (i.e. with capital letters)
      const currentAccount$ = merge(initialAccount$, newAccount$).pipe(
        distinctUntilChanged((a, b) => a.toLowerCase() === b.toLowerCase()),
        switchMap(() => from(web3.eth.getAccounts()).pipe(map(x => x[0]))),
      );

      resolve(currentAccount$);
    } catch (err) {
      reject(err);
    }
  });

module.exports = createCurrentAccount$;
