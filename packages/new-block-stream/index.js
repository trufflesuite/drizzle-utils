const fromSubscribe = require("./fromSubscribe");
const fromPolling = require("./fromPolling");

const createNewBlock$ = ({
  web3,
  pollingInterval,
  skipBlocks = false,
} = {}) => {
  if (!web3) {
    throw new Error("The options object with web3 is required.");
  }

  const providerType = web3.currentProvider.constructor.name;
  if (!pollingInterval && providerType === "WebsocketProvider") {
    // use web3.eth.subscribe to listen for new blocks
    return fromSubscribe({ web3 });
  }

  // do polling instead
  return fromPolling({ web3, pollingInterval, skipBlocks });
};

module.exports = createNewBlock$;
