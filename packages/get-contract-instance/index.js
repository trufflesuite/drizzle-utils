const getContractInstance = (options = {}) =>
  new Promise(async (resolve, reject) => {
    if (!options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }

    const { web3 } = options;

    try {
      if (options.artifact) {
        // if artifact exists, attempt to get network ID and the deployed address
        const { artifact } = options;

        // handle malformed artifact with missing ABI
        if (!artifact.abi) {
          return reject(
            new Error("Your artifact must contain the ABI of the contract."),
          );
        }

        // if no networks object is found, instantiate without the address
        if (!artifact.networks) {
          const instance = new web3.eth.Contract(artifact.abi);
          return resolve(instance);
        }

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = artifact.networks[networkId];

        // if no deployed address is found, instantiate without the address
        const address = deployedNetwork && deployedNetwork.address;

        const instance = new web3.eth.Contract(artifact.abi, address);
        return resolve(instance);
      } else if (options.abi) {
        // otherwise, use passed-in ABI and deployed address (optional)
        const { abi, address } = options;

        const instance = new web3.eth.Contract(abi, address);
        return resolve(instance);
      }
      return reject(
        new Error(
          "You must pass in a contract artifact or the ABI of a deployed contract.",
        ),
      );
    } catch (err) {
      return reject(err);
    }
  });

module.exports = getContractInstance;
