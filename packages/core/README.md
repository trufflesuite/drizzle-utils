# @drizzle-utils/core

A tool to make frontend dapp development a little bit sweeter.

## Usage

```js
import DrizzleUtils from "@drizzle-utils/core";

const drizzleUtils = new DrizzleUtils(); // drizzleUtils is a stateful instance
await drizzleUtils.init(); // init method returns a promise

console.log(drizzleUtils.web3); // the web3 instance wrapped by drizzle-utils
console.log(drizzleUtils.accounts); // this is always kept up-to-date

// you can also subscribe to the currentAccount$ observable
drizzleUtils.currentAccount$.subscribe(addr => console.log("addr"));
```

Note that, `drizzleUtils.currentAccount$` is a regular RxJS 6 Observable. In its simplest usage, we simply subscribe to it and log out the current account address.

For a real usage example, see the `test-app` directory. Or more specifically, `test-app/src/App.js`.
