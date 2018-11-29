# @drizzle-utils/get-web3

A tool for getting the Web3 object.

This supports:

- A custom provider that you can specify
- A provider injected by MetaMask (i.e. `window.ethereum`)
- A web3 object injected by legacy dapp browsers (i.e. `window.web3`)
- A fallback provider that you can specify if the above do not exist
- If all else fails, it defaults to `"http://127.0.0.1:9545"`, which is the default for `truffle develop`

This library also takes care of the case where the page is not finished loading as well as the case where the page is already finished loading when the function is called. In other words, you can call `getWeb3()` at anytime.

## Usage

```js
import getWeb3 from "@drizzle-utils/get-web3";
import Web3 from "web3";  // only required for custom/fallbakc provider option

// simple
const web3 = await getWeb3();

// custom provider
const host = "http://127.0.0.1:1111";
const customProvider = new Web3.providers.HttpProvider(host);
const web3 = await getWeb3({ customProvider });

// fallback provider
const host = "http://127.0.0.1:2222";
const fallbackProvider = new Web3.providers.HttpProvider(host);
const web3 = await getWeb3({ fallbackProvider });
```

For detailed usage example, see the `test-app` directory, specifically `test-app/src/App.js`.