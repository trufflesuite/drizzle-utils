/**
 * @jest-environment node
 */
const Ganache = require("ganache-core");
const Web3 = require("web3");
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const { take, finalize, tap, toArray } = require("rxjs/operators");

const compile = require("./utils/compile");
const createContractData$ = require("../index");

jest.setTimeout(20000);

describe("contract-data-stream tests in node environment", () => {
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

  test("createContractData$ function exists", () => {
    expect(createContractData$).toBeDefined();
  });

  test("can track changes to a call method return value", async done => {
    const { observable } = await createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    const returnVal$ = await createContractData$({
      newBlock$: observable,
      methodCall: contractInstance.methods.get(),
    });

    returnVal$
      .pipe(
        take(2),
        toArray(),
        tap(vals => expect(vals).toEqual(["0", "5"])),
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
