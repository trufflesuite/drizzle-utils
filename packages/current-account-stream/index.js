const { Subject, from, merge } = require("rxjs");
const { map, distinctUntilChanged, switchMap } = require("rxjs/operators");

const createNewAccount$ = web3 => {
  const observable = new Subject();
  web3.currentProvider.publicConfigStore.on("update", data => {
    observable.next(data.selectedAddress);
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
      const newAccount$ = createNewAccount$(web3);

      const currentAccount$ = merge(initialAccount$, newAccount$).pipe(
        distinctUntilChanged((a, b) => a.toLowerCase() === b.toLowerCase()),
        switchMap(() => from(web3.eth.getAccounts()).pipe(map(x => x[0])))
      );

      resolve(currentAccount$);
    } catch (err) {
      reject(err);
    }
  });

module.exports = createCurrentAccount$;
