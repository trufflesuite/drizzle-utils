/**
 * @jest-environment node
 */
// const Web3 = require("web3");
const { take, finalize, tap, toArray } = require("rxjs/operators");
const initTestChain = require("@drizzle-utils/test-chain");
const createNewBlock$ = require("../index");
const { blockMatcher } = require("./utils/propertyMatchers");

jest.setTimeout(20000);

describe("new-block-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;

  beforeAll(async () => {
    ({ provider, web3, accounts, contractInstance } = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorage.sol",
        contractName: "SimpleStorage",
      },
    }));
  });

  afterAll(async () => {
    provider.close();
  });

  test("createNewBlock$ function exists", () => {
    expect(createNewBlock$).toBeDefined();
  });

  test("createNewBlock$ throws errors when required options fields not found", () => {
    expect(() => createNewBlock$()).toThrow();

    expect(() => createNewBlock$({ pollingInterval: 200 })).toThrow(
      new Error("The options object with web3 is required."),
    );
  });

  test("fromPolling can track blocks", async done => {
    const newBlock$ = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    // tap observable to make sure it emitted a "0" and then a "5"
    newBlock$
      .pipe(
        take(2),
        toArray(),
        tap(vals => {
          expect(vals[0]).toMatchSnapshot(blockMatcher);
          expect(vals[1]).toMatchSnapshot(blockMatcher);
        }),
        finalize(() => {
          expect.assertions(2);
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });

  // Remove test for subscribing to blocks, because we can't properly simulate
  // with Ganache, a provider that Web3 will allow us to subscribe to it.
  // test("fromSubscribe can track blocks", async done => {
  //   // Change constructor so we can test Websocket route
  //   // Note that ganache provider.constructor.name is Provider
  //   function WebsocketProvider() {}
  //   const web3Ws = new Web3(provider);
  //   web3Ws.currentProvider.constructor = WebsocketProvider;

  //   const newBlock$ = createNewBlock$({
  //     web3: web3Ws,
  //     pollingInterval: 200,
  //   });

  //   // tap observable to make sure it emitted a "0" and then a "5"
  //   newBlock$
  //     .pipe(
  //       take(2),
  //       toArray(),
  //       tap(vals => {
  //         expect(vals[0]).toMatchSnapshot(blockMatcher);
  //         expect(vals[1]).toMatchSnapshot(blockMatcher);
  //       }),
  //       finalize(() => {
  //         expect.assertions(2);
  //         done();
  //       }),
  //     )
  //     .subscribe();

  //   await contractInstance.methods.set(0).send({ from: accounts[0] });
  //   await contractInstance.methods.set(5).send({ from: accounts[0] });
  // });
});
