/**
 * @jest-environment node
 */
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const { take, finalize, tap, toArray } = require("rxjs/operators");
const initTestChain = require("@drizzle-utils/test-ganache");

const createContractState$ = require("../index");

jest.setTimeout(20000);

describe("contract-state-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;
  let artifact;

  beforeAll(async () => {
    const { contractArtifact, ...rest } = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorage.sol",
        contractName: "SimpleStorage",
      },
    });

    ({ provider, web3, accounts, contractInstance } = rest);

    artifact = {
      ...contractArtifact,
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

  test("ensure test suite setup works", async () => {
    // Get old value, set a new value, check to see if it was set correctly
    const oldVal = await contractInstance.methods.get().call();
    await contractInstance.methods.set(5).send({ from: accounts[0] });
    const newVal = await contractInstance.methods.get().call();

    expect(oldVal).toBe("0");
    expect(newVal).toBe("5");
  });

  test("createContractState$ function exists", () => {
    expect(createContractState$).toBeDefined();
  });

  test("createContractState$ throws errors when required options fields not found", async () => {
    expect(() => createContractState$()).toThrow();

    expect(() => createContractState$({ artifact, provider })).toThrow(
      new Error("The options object with newBlock$ is required"),
    );

    const { observable: newBlock$, subscription } = createNewBlock$({
      web3,
      pollingInterval: 1,
    });
    expect(() => createContractState$({ newBlock$, provider })).toThrow(
      new Error("The options object with artifact is required"),
    );

    expect(() => createContractState$({ newBlock$, artifact })).toThrow(
      new Error("The options object with provider is required"),
    );

    subscription.unsubscribe();
  });

  test("can track changes to a send method return value", async done => {
    const { observable: newBlock$, subscription } = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    const returnVal$ = createContractState$({
      newBlock$,
      artifact,
      provider,
    });

    // tap observable to make sure it emitted a "0" and then a "5"
    returnVal$
      .pipe(
        take(2),
        toArray(),
        tap(vals => expect(vals).toMatchSnapshot()),
        finalize(() => {
          expect.assertions(1);
          subscription.unsubscribe();
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });
});
