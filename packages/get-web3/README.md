# @drizzle-utils/get-web3

A tool for getting the Web3 object with different potential sources for providers.

### Provider loading order

The provider to be used is determined in the following order:

1. A **custom provider** that you can specify with the `customProvider` option
2. A provider injected by MetaMask (i.e. `window.ethereum`)
3. A web3 object injected by legacy dapp browsers (i.e. `window.web3`)
4. A **fallback provider** that you can specify with the `fallbackProvider` option
5. If all else fails, it defaults to `"http://127.0.0.1:9545"`, which is the default for `truffle develop`

Note the difference between the **custom provider** and the **fallback provider** option. The custom provider option assumes you _always_ want to use the passed-in provider first, whereas the fallback provider serves as a last-resort. See below for an usage example.

### Supported Environments

- Node.js 8 and above
- Browser (Chromium)
- React Native

### Page load status

You can call `getWeb3()` whenever you want. If `document.readyState` is `"complete"`, it will attempt to get Web3 immediately. Otherwise, it will wait until the page `load` event fires.

## Usage

### Simple usage

```js
import getWeb3 from "@drizzle-utils/get-web3";

const web3 = await getWeb3();
```

### Custom provider

```js
import getWeb3 from "@drizzle-utils/get-web3";
import Web3 from "web3";

const host = "http://127.0.0.1:1111";
const customProvider = new Web3.providers.HttpProvider(host);
const web3 = await getWeb3({ customProvider });
```

### Fallback provider

```js
import getWeb3 from "@drizzle-utils/get-web3";
import Web3 from "web3";

const host = "http://127.0.0.1:2222";
const fallbackProvider = new Web3.providers.HttpProvider(host);
const web3 = await getWeb3({ fallbackProvider });
```

For detailed usage example, see the `test-app` directory, specifically `test-app/src/App.js`.