/**
 * @jest-environment node
 */
const {
  take,
  finalize,
  tap,
  toArray,
  distinctUntilChanged,
} = require("rxjs/operators");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const initTestChain = require("@drizzle-utils/test-chain");
const { stateMatcher } = require("./utils/propertyMatchers");

const createContractState$ = require("../index");

jest.setTimeout(20000);

describe("contract-state-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;
  let artifact;

  beforeAll(async () => {
    const testChain = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorage.sol",
        contractName: "SimpleStorage",
      },
    });

    ({ provider, web3, accounts, contractInstance } = testChain);

    const networkId = await web3.eth.net.getId();

    artifact = {
      ...testChain.contractArtifact,
      // truffle-decoder needs this in artifact
      networks: {
        [networkId]: {
          address: contractInstance.address,
        },
      },
    };
  });

  afterAll(async () => {
    provider.close();
  });

  test("createContractState$ function exists", () => {
    expect(createContractState$).toBeDefined();
  });

  test("createContractState$ throws errors when required options fields not found", async () => {
    expect(() => createContractState$()).toThrow();

    expect(() => createContractState$({ artifact, provider })).toThrow(
      new Error("The options object with newBlock$ is required"),
    );

    const newBlock$ = createNewBlock$({
      web3,
      pollingInterval: 1,
    });
    expect(() => createContractState$({ newBlock$, provider })).toThrow(
      new Error("The options object with artifact is required"),
    );

    expect(() => createContractState$({ newBlock$, artifact })).toThrow(
      new Error("The options object with provider is required"),
    );
  });

  test("can track changes to a send method return value", async done => {
    const newBlock$ = createNewBlock$({
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
        distinctUntilChanged((x, y) => {
          const a = x.variables.storedData.value.toString();
          const b = y.variables.storedData.value.toString();
          return a === b;
        }),
        take(2),
        toArray(),
        tap(responses => {
          expect(responses[0]).toMatchSnapshot(stateMatcher);
          expect(responses[1]).toMatchSnapshot(stateMatcher);
          expect(responses[0].variables.storedData.value.toString()).toBe("0");
          expect(responses[1].variables.storedData.value.toString()).toBe("5");
          // const vals = responses.map(x =>
          //   x.variables.storedData.value.toString(),
          // );
          // expect(vals).toEqual(["0", "5"]);
        }),
        finalize(() => {
          expect.assertions(4);
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });
});
