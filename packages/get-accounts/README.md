# @drizzle-utils/get-accounts

A tool for getting the accounts from Web3. This will request MetaMask's permission, if required.

Example usage is located in the `test-app` directory, specifically `test-app/src/App.js`.

## Usage

```js
import getAccounts from "@drizzle-utils/get-accounts";

// pass in your web3 (required)
const accounts = await getAccounts({ web3 });
console.log(accounts); // ["0x..."]
```
