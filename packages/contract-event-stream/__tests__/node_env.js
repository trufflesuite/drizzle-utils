/**
 * @jest-environment node
 */
const Web3 = require("web3");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const { take, finalize, tap, toArray } = require("rxjs/operators");
const initTestChain = require("@drizzle-utils/test-chain");

const createContractEvent$ = require("../index");

jest.setTimeout(20000);

describe("contract-event-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;
  let artifact;

  beforeAll(async () => {
    const testChain = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorageWithEvents.sol",
        contractName: "SimpleStorageWithEvents",
      },
    });

    ({ provider, web3, accounts, contractInstance } = testChain);

    artifact = {
      ...testChain.contractArtifact,
      // truffle-decoder needs this in artifact
      networks: {
        "4447": {
          address: contractInstance._address,
        },
      },
    };
  });

  afterAll(async () => {
    provider.close();
  });

  test("createContractEvent$ function exists", () => {
    expect(createContractEvent$).toBeDefined();
  });

  test("createContractEvent$ throws errors when required options fields not found", () => {
    const { _address: address } = contractInstance;
    const { abi } = artifact;

    expect(() => createContractEvent$()).toThrow();

    expect(() => createContractEvent$({ abi, address })).toThrow(
      new Error("The options object with web3 is required"),
    );

    expect(() => createContractEvent$({ web3, address })).toThrow(
      new Error("The options object with contract abi is required"),
    );

    expect(() => createContractEvent$({ web3, abi })).toThrow(
      new Error("The options object with contract address is required"),
    );

    const web3Http = new Web3("http://127.0.0.1:9545"); // HttpProvider
    expect(() =>
      createContractEvent$({ web3: web3Http, abi, address }),
    ).toThrow(
      new Error("Must provide newBlock$ when using http provider with web3"),
    );
  });

  test("fromPolling can track events emitted by send method", async done => {
    const { observable: newBlock$, cleanup } = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    const { _address: address } = contractInstance;
    const { abi } = artifact;
    const event$ = createContractEvent$({ web3, abi, address, newBlock$ });

    // tap observable to make sure it emitted a "0" and then a "5"
    event$
      .pipe(
        take(2),
        toArray(),
        tap(vals => {
          expect(vals[0].returnValues.storedData).toBe("0");
          expect(vals[1].returnValues.storedData).toBe("5");
        }),
        finalize(() => {
          expect.assertions(2);
          cleanup();
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });

  test("fromSubscribe can track events emitted by send method", async done => {
    // Change constructor so we can test Websocket route
    // Note that ganache provider.constructor.name is Provider
    function WebsocketProvider() {}
    const web3Ws = new Web3(provider);
    web3Ws.currentProvider.constructor = WebsocketProvider;

    const { _address: address } = contractInstance;
    const { abi } = artifact;
    const event$ = createContractEvent$({ web3: web3Ws, abi, address });

    // tap observable to make sure it emitted a "0" and then a "5"
    event$
      .pipe(
        take(2),
        toArray(),
        tap(vals => {
          expect(vals[0].returnValues.storedData).toBe("0");
          expect(vals[1].returnValues.storedData).toBe("5");
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
});
