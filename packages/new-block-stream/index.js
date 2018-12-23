const fromSubscribeMethod = require("./fromSubscribeMethod");
const fromPolling = require("./fromPolling");

const createNewBlock$ = options =>
  new Promise(async (resolve, reject) => {
    if (!options || !options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }
    let { web3, pollingInterval } = options;

    const providerType = web3.currentProvider.constructor.name;
    if (providerType === "WebsocketProvider") {
      // use web3.eth.subscribe to listen for new blocks
      return resolve(fromSubscribeMethod({ web3 }));
    }

    // fallback to polling with eth-block-tracker
    return resolve(fromPolling({ web3, pollingInterval }));
  });

module.exports = createNewBlock$;
