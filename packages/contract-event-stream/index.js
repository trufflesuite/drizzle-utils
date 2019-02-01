const fromPolling = require("./fromPolling");
const fromSubscribe = require("./fromSubscribe");

const createContractEvent$ = (options = {}) => {
  const { web3, abi, address, pollingInterval } = options;
  if (!web3) throw new Error("The options object with web3 is required");
  if (!abi) throw new Error("The options object with contract abi is required");
  if (!address)
    throw new Error("The options object with contract address is required");

  const providerType = web3.currentProvider.constructor.name;

  // TODO: perhaps use get-contract-instance
  const contract = new web3.eth.Contract(abi, address);

  // TODO: for subs, return sub so user can unsub
  // Events subscription only works with websocket provider
  if (providerType === "WebsocketProvider") {
    return fromSubscribe({ contract });
  }

  return fromPolling({ web3, pollingInterval, contract });
};

module.exports = createContractEvent$;
