const { Observable, from, merge } = require("rxjs");
const { map, distinctUntilChanged, switchMap } = require("rxjs/operators");

// taps into MetaMask API for the accountsChanged event
const createMetaMaskUpdate$ = ethereum => {
  const observable = new Observable(subscriber => {
    ethereum.on("accountsChanged", accounts => {
      subscriber.next(accounts[0]);
    });
  });
  return observable;
};

// wraps an un-documented API for updates into a stream
const createLegacyUpdate$ = web3 => {
  const observable = new Observable(subscriber => {
    web3.currentProvider.publicConfigStore.on("update", data => {
      subscriber.next(data.selectedAddress);
    });
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
      const metaMaskDetected = typeof window !== "undefined" && window.ethereum;
      if (metaMaskDetected) {
        await window.ethereum.enable();
      }

      const initialAccount$ = from(web3.eth.getAccounts()).pipe(map(x => x[0]));
      const newAccount$ = metaMaskDetected
        ? createMetaMaskUpdate$(window.ethereum)
        : createLegacyUpdate$(web3);

      // Note: addresses from `newAccount$` may be lowercased, therefore we
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
