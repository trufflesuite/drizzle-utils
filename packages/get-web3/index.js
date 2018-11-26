const getWeb3 = async options => {
  if (!window) {
    // TODO - handle environments without a `window` object
  }

  if (window.ethereum) {
    // TODO - handle case for injected `ethereum` object by MetaMask
  } else if (typeof window.web3 !== "undefined") {
    // TODO - handle case for legacy dapp browsers with injected Web3
  } else {
    // TODO - use fallback options
  }
};

export default getWeb3;
