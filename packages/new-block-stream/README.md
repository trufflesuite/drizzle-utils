# @drizzle-utils/new-block-stream

A tool for creating a stream of new block data.

## Usage

### Getting started

Install via NPM:

```js
npm install @drizzle-utils/new-block-stream
```

Usage example (taken from `@drizzle-utils/new-block-stream/example.js`)

```js
/* eslint-disable no-console */
const Web3 = require("web3");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");

const main = async () => {
  // const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
  const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider

  const { observable, subscription } = createNewBlock$({
    web3,
    pollingInterval: 200, // only used if non-WebsocketProvider
  });

  // log out new blocks (might skip blocks if polling)
  const stream = observable.subscribe(console.log);

  // 10 seconds later, unsubscribe
  setTimeout(() => {
    console.log("unsubscribing...");
    subscription.unsubscribe();
    stream.unsubscribe();
    process.exit();
  }, 10000);
};

main();
```

## API

### createNewBlock$

Creates an RxJS observable that will monitor the blockchain for new blocks. Supports both [Web3 subscriptions](https://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html#eth-subscribe) and polling.

#### Parameters

options - `Object`
  - web3 - `Object`: A [Web3 instance](https://web3js.readthedocs.io/en/1.0/web3.html#web3)
  - pollingInterval (only used for non-WebsocketProvider) - `Number`: The rate in milliseconds at which the stream should poll for new blocks.


#### Returns

`Object`

- observable: An RxJS observable.
- subscription

  If Web3 subscription: `subscription` is a reference to the underlying [Web3 subscription](https://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html#eth-subscribe).

  If polling, `subscription` is an `Object` with the following fields:
  - unsubscribe - `Function`: Unsubscribe from either the web3.eth subscription or the polling block tracker.

#### Example

Web3 subscription using a WebSocketProvider:

```js
const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider
const { observable, subscription } = createNewBlock$({ web3 });
```

Will fallback to polling if provider is not a WebSocketProvider.

Polling using a HttpProvider:

```js
const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
const { observable, subscription } = createNewBlock$({
  web3,
  pollingInterval: 200, // only used if non-WebsocketProvider
});
```