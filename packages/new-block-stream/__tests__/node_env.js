/**
 * @jest-environment node
 */
const Ganache = require("ganache-core");
const Web3 = require("web3");
const { take, finalize, tap, toArray } = require("rxjs/operators");

const compile = require("./utils/compile");
const createNewBlock$ = require("../index");
const makePropertyMatcher = require("./utils/makePropertyMatcher");

jest.setTimeout(20000);

describe("new-block-stream tests in node environment", () => {
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
    const { observable: newBlock$, subscription } = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    // tap observable to make sure it emitted a "0" and then a "5"
    newBlock$
      .pipe(
        take(2),
        toArray(),
        tap(vals =>
          vals.forEach(val => {
            expect(val).toMatchSnapshot(makePropertyMatcher());
          }),
        ),
        finalize(() => {
          expect.assertions(2);
          subscription.unsubscribe();
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });

  test("fromSubscribeMethod can track blocks", async done => {
    // Change constructor so we can test Websocket route
    // Note that ganache provider.constructor.name is Provider
    function WebsocketProvider() {}
    const web3Ws = new Web3(provider);
    web3Ws.currentProvider.constructor = WebsocketProvider;

    const { observable: newBlock$, subscription } = createNewBlock$({
      web3: web3Ws,
      pollingInterval: 200,
    });

    // tap observable to make sure it emitted a "0" and then a "5"
    newBlock$
      .pipe(
        take(2),
        toArray(),
        tap(vals =>
          vals.forEach(val => {
            expect(val).toMatchSnapshot(makePropertyMatcher());
          }),
        ),
        finalize(() => {
          expect.assertions(2);
          subscription.unsubscribe();
          done();
        }),
      )
      .subscribe();

    await contractInstance.methods.set(0).send({ from: accounts[0] });
    await contractInstance.methods.set(5).send({ from: accounts[0] });
  });
});
