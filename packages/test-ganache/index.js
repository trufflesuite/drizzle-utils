const Ganache = require("ganache-core");
const Web3 = require("web3");
const compile = require("./compile");

const deployContract = async ({ web3, account, contractArtifact }) => {
  // Create initial contract instance
  const instance = new web3.eth.Contract(contractArtifact.abi);

  // Deploy contract and get new deployed Instance
  // Note: deployed address located at `deployedInstance._address`
  const deployedInstance = await instance
    .deploy({ data: contractArtifact.bytecode })
    .send({ from: account, gas: 150000 });
  return deployedInstance;
};

const initWithContract = async ({
  contract: { dirname, filename, contractName },
}) => {
  // 1. Compile contract artifact
  const { [contractName]: contractArtifact } = await compile({
    dirname,
    filename,
  });

  // 2. Spawn Ganache test blockchain
  const provider = Ganache.provider({ seed: "drizzle-utils" });
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();

  // 3. Deploy contract
  const deployedInstance = await deployContract({
    web3,
    account: accounts[0],
    contractArtifact,
  });

  return { contractInstance: deployedInstance, provider, web3, accounts };
};

module.exports = initWithContract;
