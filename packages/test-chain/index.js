const Ganache = require("ganache-core");
const Web3 = require("web3");
const compile = require("./compile");

const defaultGanacheOptions = { seed: "drizzle-utils" };

const initProviderWeb3 = async ganacheOptions => {
  // Spawn Ganache test blockchain

  const provider = Ganache.provider(ganacheOptions || defaultGanacheOptions);
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();

  return { provider, web3, accounts };
};

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

const initContract = async ({ web3, account, contract }) => {
  const { dirname, filename, contractName } = contract;

  // Compile contract artifact
  const { [contractName]: contractArtifact } = await compile({
    dirname,
    filename,
  });

  // Deploy contract
  const contractInstance = await deployContract({
    web3,
    account,
    contractArtifact,
  });

  return { contractInstance, contractArtifact };
};

const initTestChain = async ({ contract, ganacheOptions } = {}) => {
  const { provider, web3, accounts } = await initProviderWeb3(ganacheOptions);

  if (contract) {
    const { contractInstance, contractArtifact } = await initContract({
      web3,
      account: accounts[0],
      contract,
    });
    return {
      provider,
      web3,
      accounts,
      contractInstance,
      contractArtifact,
    };
  }

  return {
    provider,
    web3,
    accounts,
  };
};

module.exports = initTestChain;
