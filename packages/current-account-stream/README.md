# @drizzle-utils/current-account-stream

Returns an RxJS observable so you can watch for changes to the currently selected account on MetaMask.

Detailed example usage is located in the `test-app` directory, specifically `test-app/src/App.js`.

## Usage

```js
import createCurrentAccount$ from "@drizzle-utils/current-account-stream";

// pass in your web3 and create the observable
const currentAccount$ = await createCurrentAccount$({ web3 });

// subscribe to the observable
currentAccount$.subscribe(address => console.log(address));
```
