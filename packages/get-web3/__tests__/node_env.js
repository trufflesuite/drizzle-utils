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
    const host = "http://127.0.0.1:1111";
    const customProvider = new Web3.providers.HttpProvider(host);
    const web3 = await getWeb3({ customProvider });

    expect(web3.currentProvider.host).toBe(host);
  });

  test("fallback provider works properly", async () => {
    const host = "http://127.0.0.1:2222";
    const fallbackProvider = new Web3.providers.HttpProvider(host);
    const web3 = await getWeb3({ fallbackProvider });

    expect(web3.currentProvider.host).toBe(host);
  });

  test("default fallback provider exists", async () => {
    const web3 = await getWeb3();

    expect(web3.currentProvider.host).toBe("http://127.0.0.1:9545");
  });
});
