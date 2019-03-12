# @drizzle-utils/test-chain

Utils for spawning a test blockchain to run automated tests on.

## Usage

### Getting started

Install via NPM:

```
npm install @drizzle-utils/test-chain
```

Usage example (taken from `@drizzle-utils/new-block-stream/__tests__/node_env.js`):

```js
/**
 * @jest-environment node
 */
const Web3 = require("web3");
const initTestChain = require("@drizzle-utils/test-chain");

describe("new-block-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;

  beforeAll(async () => {
    // Assign results from initTestChain to be accessed by all tests
    ({ provider, web3, accounts, contractInstance } = await initTestChain({
      contract: {
        dirname: __dirname, // contracts folder is a sibling to this .test.js file
        filename: "SimpleStorage.sol",
        contractName: "SimpleStorage",
      },
      ganacheOptions: {
        port: "1234",
      },
    }));
  });

  afterAll(async () => {
    // Make sure to close the provider after all tests are done
    provider.close();
  });

  test("fromPolling can track blocks", async done => {
    // Do your other test stuff up here...

    // Call your contract instance
    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });
});
```

## API

### initTestChain

Intializes the test chain with an optional contract deployed to it.

#### Parameters

1. options - `Object` (optional)
    - contract - `Object` (optional)
      - dirname - `String`: The directory to search for a `contracts` folder.
      - filename - `String`: The Solidity filename.
      - contractName - `String`: The contract name.
    - ganacheOptions - `Object`: [Ganache options object](https://github.com/trufflesuite/ganache-core#usage)


#### Returns

`Object`
  - provider: A web3 provider.
  - web3: A [web3 instance](https://web3js.readthedocs.io/en/1.0/web3.html#web3).
  - accounts - `String[]`: An array of address strings.
  - contractInstance: (if `contract` was specified in `options` parameter) A [web3 contract instance](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html).
  - contractArtifact: (if `contract` was specified in `options` parameter) The `json` contract artifact.
