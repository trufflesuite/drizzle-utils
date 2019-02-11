/**
 * @jest-environment node
 */
const Ganache = require("ganache-core");
const Web3 = require("web3");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const { take, finalize, tap, toArray } = require("rxjs/operators");

const compile = require("./utils/compile");
const createContractCall$ = require("../index");

jest.setTimeout(20000);

describe("contract-call-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  let contractInstance;
  beforeAll(async () => {
    // 1. Compile contract artifact
    const { SimpleStorage } = await compile("SimpleStorage.sol");

    // 2. Spawn Ganache test blockchain
    provider = Ganache.provider({ seed: "drizzle-utils" });
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();

    // 3. Create initial contract instance
    const instance = new web3.eth.Contract(SimpleStorage.abi);

    // 4. Deploy contract and get new deployed Instance
    const deployedInstance = await instance
      .deploy({ data: SimpleStorage.bytecode })
      .send({ from: accounts[0], gas: 150000 });

    // Note: deployed address located at `deployedInstance._address`

    contractInstance = deployedInstance;
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

  test("createContractCall$ function exists", () => {
    expect(createContractCall$).toBeDefined();
  });

  test("createContractCall$ throws errors when required options fields not found", () => {
    const { observable: newBlock$ } = createNewBlock$({
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
    const { observable: newBlock$, subscription } = createNewBlock$({
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
        take(2),
        toArray(),
        tap(vals => expect(vals).toEqual(["0", "5"])),
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
