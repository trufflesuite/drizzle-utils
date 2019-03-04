/**
 * @jest-environment node
 */
const Ganache = require("ganache-core");
const Web3 = require("web3");
const getContractInstance = require("../index");
const SampleContractArtifact = require("./SampleContractArtifact.json");
const SampleContractArtifactNoNetworks = require("./SampleContractArtifactNoNetworks.json");

describe("get-contract-instance tests in node environment", () => {
  let provider;
  let web3;
  beforeAll(() => {
    provider = Ganache.provider({
      seed: "drizzle-utils",
      network_id: "1234",
    });
    web3 = new Web3(provider);
  });

  afterAll(() => {
    provider.close();
  });

  test("getContractInstance function exists", () => {
    expect(getContractInstance).toBeDefined();
  });

  test("throw error if no web3", async () => {
    expect(getContractInstance()).rejects.toThrow(
      "The options object with web3 is required.",
    );
  });

  test("throw error if web3 exists, but no artifacts/abi/address", async () => {
    expect(getContractInstance({ web3 })).rejects.toThrow(
      "You must pass in a contract artifact or the ABI of a deployed contract.",
    );
  });

  test("throw error if artifact is faulty", async () => {
    expect(getContractInstance({ web3, artifact: {} })).rejects.toThrow(
      new TypeError("Cannot read property '1234' of undefined"),
    );
  });

  test("throw error if ABI is faulty", async () => {
    expect(getContractInstance({ web3, abi: {} })).rejects.toThrow(
      "You must provide the json interface of the contract when instantiating a contract object.",
    );
  });

  test("test instantiation from Truffle JSON artifact", async () => {
    const instance = await getContractInstance({
      web3,
      artifact: SampleContractArtifact,
    });
    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
  });

  test("test instantiation from Truffle JSON artifact w/ no networks object", async () => {
    const instance = await getContractInstance({
      web3,
      artifact: SampleContractArtifactNoNetworks,
    });
    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
  });

  test("test instantiation from ABI array", async () => {
    const instance = await getContractInstance({
      web3,
      abi: SampleContractArtifact.abi,
    });
    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
  });
});
