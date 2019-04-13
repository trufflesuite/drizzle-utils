# Drizzle Utils

A library for interacting with Ethereum smart contracts based on [RxJS](https://github.com/ReactiveX/rxjs) streams.

You can easily subscribe to events, contract state, and read-only methods. This library supports browser, node (i.e. server-side), and React Native environments.

## Usage

Note that the `$` at the end of a variable name denotes an [RxJS](https://github.com/ReactiveX/rxjs) stream. You can call `.subscribe` on it and use any RxJS stream operators of your choosing.

### Getting started

Install via NPM:

```
npm install @drizzle-utils/core @drizzle-utils/get-web3
```

Usage example:

```js
// import/require the packages you need
const getWeb3 = require("@drizzle-utils/get-web3");
const createDrizzleUtils = require("@drizzle-utils/core");

// initialize the tooling
const web3 = await getWeb3();
const drizzleUtils = await createDrizzleUtils({ web3 });
const accounts = await drizzleUtils.getAccounts();

// `instance` is a web3 Contract instance of the deployed contract
const instance = await drizzleUtils.getContractInstance({
  artifact: contractArtifact,
});
```

### Getting the Web3 instance

Refer to these [docs](./packages/get-web3/README.md) for reference.

### Streaming contract events

Returns a Promise that resolves to an RxJS stream of events.

```js
const event$ = await drizzleUtils.createEvent$({
  instance: contractInstance, // web3 contract instance
});

event$.subscribe(event => console.log(event));
```

Alternatively, you can pass in the artifact:

```js
const event$ = await drizzleUtils.createEvent$({
  artifact: contractArtifact,
});

event$.subscribe(event => console.log(event));
```

### Streaming the contract state

Returns a Promise that resolves to an RxJS stream of contract states.

```js
const state$ = await drizzleUtils.createState$({
  artifact: contractArtifact,
});

state$.subscribe(state => console.log(state));
```

### Streaming a constant read-only method from a contract

In this example, `get` is a read-only method in our contract.

```js
const call$ = await drizzleUtils.createCall$({
  methodCall: instance.methods.get(),
});

call$.subscribe(result => console.log(result));
```

### Current account stream

When the user changes accounts via MetaMask, you can watch for changes using the `drizzleUtils.currentAccount$` stream.

```js
// The current account stream is created upon instantiation
drizzleUtils.currentAccount$.subscribe(account => console.log(account));
```

### Using specific packages

Find the package under the `packages` directory and refer to the README there. For example, under `packages/get-web3`, the README file located there illustrates multiple ways to use a custom provider.

## For development

Make sure you have Yarn installed globally.

1. Clone the repo.
2. Run `lerna bootstrap`.
3. (Optional) Run `npm install` inside any of the `test-app` folders. Note that `yarn` may not work properly.
