# @drizzle-utils/new-block-stream

A tool for creating a stream of new block data.

## Usage

### Getting started

Install via npm:

```js
npm install @drizzle-utils/new-block-stream
```

Usage example (taken from `@drizzle-utils/new-block-stream/example.js`)

```js
const Web3 = require("web3");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");

const web3 = new Web3("ws://127.0.0.1:9545");

const { observable, subscription } = createNewBlock$({
  web3,
  pollingInterval: 200, // only used if non-WebsocketProvider
});

// log out new blocks (might skip blocks if polling)
const newBlock$ = observable.subscribe(block => console.log(block));

/* after some time, you want to stop listening to new blocks */
newBlock$.unsubscribe()     // unsubscribe from the RxJS stream
subscription.unsubscribe()  // unsubscribe from the underlying block listeners
```

## API

### createNewBlock$

Creates an RxJS observable that will monitor the blockchain for new blocks. Supports both [Web3 subscriptions](https://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html#eth-subscribe) and polling.

#### Parameters

`options` - `Object`
  - `web3` - `Object`: A [Web3 instance](https://web3js.readthedocs.io/en/1.0/web3.html#web3)
  - `pollingInterval` (only used for non-WebsocketProvider) - `Number`: The rate in milliseconds at which the stream should poll for new blocks.


#### Returns

`Object`

- `observable`: An RxJS observable.
- `subscription`

  If Web3 subscription: `subscription` is a reference to the underlying [Web3 subscription](https://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html#eth-subscribe).

  If polling, `subscription` is an `Object` with the following fields:
  - `unsubscribe` - `Function`: Unsubscribe from either the Web3 subscription or the polling block tracker.
