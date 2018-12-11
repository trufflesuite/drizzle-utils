const getContractInstance = options =>
  new Promise(async (resolve, reject) => {
    if (!options || !options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }
    const { web3, contractArtifact } = options;
    try {
      // get network ID and the deployed address
      const networkId = await web3.eth.net.getId();
      const deployedAddress = contractArtifact.networks[networkId].address;

      // create the instance
      const instance = new web3.eth.Contract(
        contractArtifact.abi,
        deployedAddress,
      );
      return resolve(instance);
    } catch (err) {
      return reject(err);
    }
  });

module.exports = getContractInstance;
