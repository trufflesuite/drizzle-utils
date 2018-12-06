/**
 * @jest-environment node
 */
const Web3 = require("web3");
const getWeb3 = require("../index");

describe("get-web3 tests in node environment", () => {
  test("getWeb3 function exists", () => {
    expect(getWeb3).toBeDefined();
  });

  test("custom provider works properly", async () => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:1111");
    const web3 = await getWeb3({ customProvider: provider });

    expect(web3.currentProvider.host).toBe("http://127.0.0.1:1111");
  });

  test("fallback provider works properly", async () => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:2222");
    const web3 = await getWeb3({ fallbackProvider: provider });

    expect(web3.currentProvider.host).toBe("http://127.0.0.1:2222");
  });

  test("default fallback provider exists", async () => {
    const web3 = await getWeb3();

    expect(web3.currentProvider.host).toBe("http://127.0.0.1:9545");
  });
});
