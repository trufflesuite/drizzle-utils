# @drizzle-utils/get-accounts

A tool for getting the accounts from Web3. This will request MetaMask's permission, if required.

Example usage is located in the `test-app` directory, specifically `test-app/src/App.js`.

## Usage

```js
import getAccounts from "@drizzle-utils/get-accounts";

// pass in your web3 (required), and an onChange callback (optionally)
const accounts = await getAccounts({ web3, onChange });
console.log(accounts) // ["0x..."]
```

The `onChange` callback functionality relies upon the undocumented API:

```js
web3.currentProvider.publicConfigStore.on("update", data =>
  console.log(data.selectedAddress) // "0x..."
);
```

The `onChange` callback will be called whenever there is an account change in MetaMask.

Note:

1. **Multiple events firing** — This event can fire multiple times even if the address is the same. Not sure why this is the case as this API is currently undocumented. The answer perhaps lie in the source code.

   As a result, make sure to check that the address is indeed new before notifying your app that the account has changed.

2. **Case-sensitive addresses** — The address in the callback (i.e. `data.selectedAddress` above) provides addresses with lowercased letters, but the `web3.eth.getAccounts()` method provides a capitals-based checksum address with uppercase letters etc. You might want to consider using the `@drizzle-utils/core` if this is going to be a problem.
