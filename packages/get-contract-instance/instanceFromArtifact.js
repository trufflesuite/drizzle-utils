/* eslint-disable no-console */

const instanceFromArtifact = async (web3, artifact, suppressWarnings) => {
  const warn = text => suppressWarnings || console.warn(text);

  // handle malformed artifact with missing ABI
  if (!artifact.abi) {
    throw new Error("Your artifact must contain the ABI of the contract.");
  }

  // if no networks object is found, instantiate without the address
  if (!artifact.networks) {
    const instance = new web3.eth.Contract(artifact.abi);
    warn("Contract instantiated without a deployed address.");
    return instance;
  }

  const networkId = await web3.eth.net.getId();
  const deployedNetwork = artifact.networks[networkId];
  const address = deployedNetwork && deployedNetwork.address;

  // if no deployed address is found, instantiate without the address
  if (!address) {
    const instance = new web3.eth.Contract(artifact.abi);
    warn("Contract instantiated without a deployed address.");
    return instance;
  }

  const instance = new web3.eth.Contract(artifact.abi, address);
  return instance;
};

module.exports = instanceFromArtifact;
