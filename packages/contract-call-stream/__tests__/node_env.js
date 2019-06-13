/**
 * @jest-environment node
 */
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const initTestChain = require("@drizzle-utils/test-chain");
const {
  take,
  tap,
  finalize,
  toArray,
  distinctUntilChanged,
} = require("rxjs/operators");

const createContractCall$ = require("../index");

jest.setTimeout(20000);

describe("contract-call-stream tests in node environment", () => {
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

  test("createContractCall$ function exists", () => {
    expect(createContractCall$).toBeDefined();
  });

  test("createContractCall$ throws errors when required options fields not found", () => {
    const newBlock$ = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    expect(() => createContractCall$()).toThrow();

    expect(() =>
      createContractCall$({ methodCall: contractInstance.methods.get() }),
    ).toThrow(new Error("The options object with newBlock$ is required"));

    expect(() => createContractCall$({ newBlock$ })).toThrow(
      new Error("The options object with methodCall is required"),
    );
  });

  test("can track changes to a call method return value", async done => {
    const newBlock$ = createNewBlock$({
      web3,
      pollingInterval: 1,
    });

    const returnVal$ = createContractCall$({
      newBlock$,
      methodCall: contractInstance.methods.get(),
    });

    // tap observable to make sure it emitted a "0" and then a "5"
    returnVal$
      .pipe(
        distinctUntilChanged((x, y) => x.toString() === y.toString()),
        take(2),
        toArray(),
        tap(vals => {
          expect(vals.map(x => x.toString())).toEqual(["0", "5"]);
        }),
        finalize(() => {
          expect.assertions(1);
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });
});
