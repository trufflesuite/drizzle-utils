/**
 * @jest-environment node
 */
const initTestChain = require("@drizzle-utils/test-chain");

const createDrizzleUtils = require("../index");

jest.setTimeout(20000);

describe("contract-event-stream tests in node environment", () => {
  let provider;
  let web3;
  let contractInstance;
  let artifact;
  let drizzleUtils;

  beforeAll(async () => {
    const testChain = await initTestChain({
      contract: {
        dirname: __dirname,
        filename: "SimpleStorageWithEvents.sol",
        contractName: "SimpleStorageWithEvents",
      },
    });

    ({ provider, web3, contractInstance } = testChain);

    const networkId = await web3.eth.net.getId();

    artifact = {
      ...testChain.contractArtifact,
      // truffle-decoder needs this in artifact
      networks: {
        [networkId]: {
          address: contractInstance.address,
        },
      },
    };

    drizzleUtils = await createDrizzleUtils({ web3 });
  });

  afterAll(async () => {
    provider.close();
  });

  test("createEvent$ successfully returns observable", async () => {
    const event$ = await drizzleUtils.createEvent$({
      abi: artifact.abi,
      address: contractInstance.address,
    });

    expect(event$).toMatchSnapshot();
  });

  test("createEvent$ successfully returns observable from artifact", async () => {
    const event$ = await drizzleUtils.createEvent$({ artifact });

    expect(event$).toMatchSnapshot();
  });

  // Test removed due to API change, see index.js for more info
  // test.skip("createEvent$ successfully returns observable from instance", async () => {
  //   const event$ = await drizzleUtils.createEvent$({
  //     instance: contractInstance,
  //   });

  //   expect(contractInstance._jsonInterface).toEqual(artifact.abi);
  //   expect(event$).toMatchSnapshot();
  // });

  test("currentAccount$ exists", async () => {
    expect(drizzleUtils.currentAccount$).toBeDefined();
    expect(drizzleUtils.currentAccount$.subscribe).toBeDefined();
  });
});
