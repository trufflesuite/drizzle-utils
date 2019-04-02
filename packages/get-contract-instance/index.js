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
        if (!address && !suppressWarnings) {
          // eslint-disable-next-line no-console
          console.warn("Contract instantiated without a deployed address.");
        }
        const instance = new web3.eth.Contract(abi, address);
        return resolve(instance);
      }

      // user passed in an artifact
      if (options.artifact) {
        const instance = await instanceFromArtifact(
          web3,
          options.artifact,
          suppressWarnings,
        );
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
