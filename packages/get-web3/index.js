const Web3 = require("web3");

const resolveWeb3 = (resolve, options) => {
  let provider;

  if (window.ethereum) {
    // use `ethereum` object injected by MetaMask
    provider = window.ethereum;
  } else if (typeof window.web3 !== "undefined") {
    // use injected web3 object by legacy dapp browsers
    provider = window.web3.currentProvider;
  } else if (options.fallbackProvider) {
    // use fallback provider from options object
    provider = options.fallbackProvider;
  } else {
    // connect to development blockchain from `truffle develop`
    provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
  }

  const web3 = new Web3(provider);
  resolve(web3);
};

const getWeb3 = options =>
  new Promise((resolve, reject) => {
    // handle environments without a `window` object
    if (!window) {
      throw new Error(
        "`window` object not found, non-browser environments are not currently supported"
      );
    }

    // resolve for web3 when the page is done loading
    if (document.readyState === `complete`) {
      resolveWeb3(resolve, options);
    } else {
      window.addEventListener("load", () => resolveWeb3(resolve, options));
    }
  });

export default getWeb3;
