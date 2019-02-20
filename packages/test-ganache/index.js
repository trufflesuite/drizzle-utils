const Ganache = require("ganache-core");
const Web3 = require("web3");
const compile = require("./compile");

const init = async ({ contract: { dirname, filename } }) => {
  // 1. Compile contract artifact
  const { SimpleStorage } = await compile({ dirname, filename });

  // 2. Spawn Ganache test blockchain
  const provider = Ganache.provider({ seed: "drizzle-utils" });
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();

  // 3. Create initial contract instance
  const instance = new web3.eth.Contract(SimpleStorage.abi);

  // 4. Deploy contract and get new deployed Instance
  // Note: deployed address located at `deployedInstance._address`
  const deployedInstance = await instance
    .deploy({ data: SimpleStorage.bytecode })
    .send({ from: accounts[0], gas: 150000 });

  return { contractInstance: deployedInstance, provider, web3, accounts };
};

module.exports = init;
