/**
 * @jest-environment node
 */
const initTestChain = require("../index");

jest.setTimeout(20000);

describe("test-chain tests in node environment", () => {
  let provider;
  let accounts;
  let contractInstance;

  beforeAll(async () => {
    ({ provider, accounts, contractInstance } = await initTestChain({
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

  test("initTestChain function exists", () => {
    expect(initTestChain).toBeDefined();
  });

  test("ensure test suite setup works", async () => {
    // Get old value, set a new value, check to see if it was set correctly
    const oldVal = await contractInstance.methods.get().call();
    await contractInstance.methods.set(5).send({ from: accounts[0] });
    const newVal = await contractInstance.methods.get().call();

    expect(oldVal).toBe("0");
    expect(newVal).toBe("5");
  });
});
