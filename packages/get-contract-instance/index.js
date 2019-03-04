const instanceFromArtifact = require("./instanceFromArtifact");

const getContractInstance = (options = {}) =>
  new Promise(async (resolve, reject) => {
    if (!options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }

    const { web3, suppressWarnings } = options;

    try {
      // user passed in ABI
      if (options.abi) {
        const { abi, address } = options;
        const instance = new web3.eth.Contract(abi, address, suppressWarnings);
        return resolve(instance);
      }

      // user passed in an artifact
      if (options.artifact) {
        const instance = await instanceFromArtifact(web3, options.artifact);
        return resolve(instance);
      }

      // neither an ABI or artifact was passed in
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
