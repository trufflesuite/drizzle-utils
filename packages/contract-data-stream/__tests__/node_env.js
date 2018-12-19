/**
 * @jest-environment node
 */
const compile = require("./utils/compile");

const createContractData$ = require("../index");

describe("contract-data-stream tests in node environment", () => {
  beforeAll(async () => {
    // eslint-disable-next-line no-unused-vars
    const artifact = await compile("SimpleStorage.sol");

    // TODO - spawn ganache
    // TODO - set provider for artifact
    // TODO - deploy contract
  });

  test("createContractData$ function exists", () => {
    expect(createContractData$).toBeDefined();
  });
});
