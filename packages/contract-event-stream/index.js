const fromPolling = require("./fromPolling");
const fromSubscribe = require("./fromSubscribe");

const createContractEvent$ = (options = {}) => {
  const { web3, abi, address, newBlock$ } = options;
  if (!web3) throw new Error("The options object with web3 is required");
  if (!abi) throw new Error("The options object with contract abi is required");
  if (!address)
    throw new Error("The options object with contract address is required");

  const providerType = web3.currentProvider.constructor.name;

  // TODO: perhaps use get-contract-instance and user just passes the entire json artifact in
  const contract = new web3.eth.Contract(abi, address);

  // TODO: for subs, return sub so user can unsub
  // Events subscription only works with websocket provider
  if (providerType === "WebsocketProvider" || web3.currentProvider.on) {
    return fromSubscribe({ contract });
  }

  if (!newBlock$)
    throw new Error(
      "Must provide newBlock$ when using http provider with web3",
    );
  return fromPolling({ contract, newBlock$ });
};

module.exports = createContractEvent$;
