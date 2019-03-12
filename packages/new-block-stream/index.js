const fromSubscribeMethod = require("./fromSubscribeMethod");
const fromPolling = require("./fromPolling");

const createNewBlock$ = ({ web3, pollingInterval } = {}) => {
  if (!web3) {
    throw new Error("The options object with web3 is required.");
  }

  const providerType = web3.currentProvider.constructor.name;
  if (providerType === "WebsocketProvider") {
    // use web3.eth.subscribe to listen for new blocks
    return fromSubscribeMethod({ web3 });
  }

  // fallback to polling with eth-block-tracker
  return fromPolling({ web3, pollingInterval });
};

module.exports = createNewBlock$;
