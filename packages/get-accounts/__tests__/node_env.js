/**
 * @jest-environment node
 */
const Ganache = require("ganache-cli");
const Web3 = require("web3");
const getAccounts = require("../index");

describe("get-accounts tests in node environment", () => {
  let web3;
  beforeAll(() => {
    const provider = Ganache.provider({ seed: "drizzle-utils" });
    web3 = new Web3(provider);
  });

  test("getAccounts function exists", () => {
    expect(getAccounts).toBeDefined();
  });

  test("throw error if no web3", async () => {
    expect(getAccounts()).rejects.toThrow(
      "The options object with web3 is required.",
    );
  });

  test("ability to get accounts, deterministically", async () => {
    const accounts = await getAccounts({ web3 });
    expect(accounts).toMatchSnapshot();
  });
});
