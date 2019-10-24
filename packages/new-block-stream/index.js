const Web3 = require("web3");
const fromSubscribe = require("./fromSubscribe");
const fromPolling = require("./fromPolling");

const createNewBlock$ = ({
  provider,
  web3,
  pollingInterval,
  skipBlocks = false,
} = {}) => {
  if (!provider && !web3) {
    throw new Error("A provider or web3 instance is required");
  }

  web3 = new Web3(web3 ? web3.currentProvider : provider);

  // NOTE: We currently do not support subscriptions, as there is no reliable way to detect support
  // const providerType = web3.currentProvider.constructor.name;
  // const useSubscribe = !pollingInterval && providerType === "WebsocketProvider"
  const useSubscribe = false;
  if (useSubscribe) {
    // use web3.eth.subscribe to listen for new blocks
    return fromSubscribe({ web3 });
  }

  // do polling instead
  return fromPolling({ web3, pollingInterval, skipBlocks });
};

module.exports = createNewBlock$;
