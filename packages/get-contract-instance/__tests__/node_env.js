/**
 * @jest-environment node
 */
const Ganache = require("ganache-core");
const Web3 = require("web3");
const getContractInstance = require("../index");
const artifact = require("./SampleContractArtifact.json");
const artifactWrongNetwork = require("./SampleContractArtifactWrongNetwork.json");
const artifactNoNetworks = require("./SampleContractArtifactNoNetworks.json");

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
      "Your artifact must contain the ABI of the contract.",
    );
  });

  test("throw error if ABI is faulty", async () => {
    expect(getContractInstance({ web3, abi: {} })).rejects.toThrow(
      "You must provide the json interface of the contract when instantiating a contract object.",
    );
  });

  test("test instantiation from Truffle JSON artifact", async () => {
    /* eslint-disable no-console */
    console.warn = jest.fn();
    const networkId = await web3.eth.net.getId();
    const deployedAddress = artifact.networks[networkId].address;
    const instance = await getContractInstance({ web3, artifact });

    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
    expect(instance._address.toLowerCase()).toEqual(deployedAddress);
    expect(console.warn.mock.calls[0]).toBe(undefined);
    /* eslint-enable no-console */
  });

  test("test instantiation from Truffle JSON artifact w/ wrong network", async () => {
    /* eslint-disable no-console */
    console.warn = jest.fn();
    const instance = await getContractInstance({
      web3,
      artifact: artifactWrongNetwork,
    });

    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
    expect(instance._address).toBeNull();
    expect(console.warn.mock.calls[0][0]).toBe(
      "Contract instantiated without a deployed address.",
    );
    /* eslint-enable no-console */
  });

  test("test instantiation from Truffle JSON artifact w/ no networks object", async () => {
    /* eslint-disable no-console */
    console.warn = jest.fn();
    const instance = await getContractInstance({
      web3,
      artifact: artifactNoNetworks,
    });

    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
    expect(instance._address).toBeNull();
    expect(console.warn.mock.calls[0][0]).toBe(
      "Contract instantiated without a deployed address.",
    );
    /* eslint-enable no-console */
  });

  test("test instantiation from ABI array", async () => {
    const instance = await getContractInstance({ web3, abi: artifact.abi });
    expect(instance).toBeDefined();
    expect(instance.methods).toBeDefined();
  });
});
