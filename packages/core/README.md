# @drizzle-utils/core

A tool to make frontend dapp development a little bit sweeter.

## Usage

```js
import DrizzleUtils from "@drizzle-utils/core";

const drizzleUtils = new DrizzleUtils();  // drizzleUtils is a stateful instance
await drizzleUtils.init();                // init method returns a promise

// after init is complete, drizzleUtils should now have web3 and accounts
console.log(drizzleUtils) // DrizzleUtils {web3: Web3, accounts: Array(1)}

// optionally, you can attach a callback to listen for account changes
drizzleUtils.onAccountChange(accounts => this.setState({ accounts }));
```

For a real usage example, see the `test-app` directory. Or more specifically, `test-app/src/App.js`.