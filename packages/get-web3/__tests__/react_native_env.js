const Web3 = require("web3");
const getWeb3 = require("../index");

describe("get-web3 tests in React Native environment", () => {
  const defaultFallbackUrl = "http://127.0.0.1:9545";

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

  // In RN window var points to global var
  test("does not attempt to connect to metamask provider", async () => {
    window.ethereum = new Web3.providers.HttpProvider("http://127.0.0.1:3333");
    const web3 = await getWeb3();

    expect(web3.currentProvider.host).toBe(defaultFallbackUrl);
    window.ethereum = undefined;
  });

  // In RN window var points to global var
  test("does not attempt to connect to legacy dapp browser provider", async () => {
    window.web3 = new Web3("http://localhost:8546");
    const web3 = await getWeb3();

    expect(web3.currentProvider.host).toBe(defaultFallbackUrl);
    window.web3 = undefined;
  });

  test("default fallback provider exists", async () => {
    const web3 = await getWeb3();

    expect(web3.currentProvider.host).toBe(defaultFallbackUrl);
  });
});
