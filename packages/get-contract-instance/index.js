const getContractInstance = (options = {}) =>
  new Promise(async (resolve, reject) => {
    if (!options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }

    const { web3 } = options;

    let instance;
    try {
      if (options.artifact) {
        // if artifact exists, get network ID and the deployed address
        const { artifact } = options;
        const networkId = await web3.eth.net.getId();
        const address = artifact.networks[networkId].address;

        instance = new web3.eth.Contract(artifact.abi, address);
      } else if (options.abi && options.address) {
        // otherwise, use passed-in ABI and deployed address
        const { abi, address } = options;

        instance = new web3.eth.Contract(abi, address);
      } else {
        return reject(
          new Error(
            "You must pass in a contract artifact or the ABI and address of a deployed contract.",
          ),
        );
      }

      return resolve(instance);
    } catch (err) {
      return reject(err);
    }
  });

module.exports = getContractInstance;
