/**
 * @jest-environment jsdom
 */
const getAccounts = require("../index");

describe("get-accounts tests in browser environment", () => {
  test("getAccounts function exists", () => {
    expect(getAccounts).toBeDefined();
  });

  test("throw error if no web3", () => {
    expect(getAccounts()).rejects.toThrow(
      "The options object with web3 is required.",
    );
  });

  // TODO - add tests for getting accounts in the browser
});
