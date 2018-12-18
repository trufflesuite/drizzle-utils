/**
 * @jest-environment node
 */
const Web3 = require("web3");
const getContractInstance = require("../index");

describe("get-contract-instance tests in node environment", () => {
  test("getContractInstance function exists", () => {
    expect(getContractInstance).toBeDefined();
  });

  test("throw error if no web3", async () => {
    expect(getContractInstance()).rejects.toThrow(
      "The options object with web3 is required.",
    );
  });

  test("throw error if web3 exists, but no artifacts/abi/address", async () => {
    expect(getContractInstance({ web3: new Web3() })).rejects.toThrow(
      "You must pass in a contract artifact or the ABI and address of a deployed contract.",
    );
  });
});
