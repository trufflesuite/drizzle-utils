/**
 * @jest-environment jsdom
 */
const getWeb3 = require("../index");

describe("get-web3 tests in browser environment", () => {
  test("getWeb3 function exists", () => {
    expect(getWeb3).toBeDefined();
  });

  test("default fallback provider exists", async () => {
    const web3 = await getWeb3();
    expect(web3.currentProvider).toMatchSnapshot();
  });
});
