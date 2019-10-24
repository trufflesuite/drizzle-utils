const Web3 = require("web3");
const fromPolling = require("./fromPolling");
const fromSubscribe = require("./fromSubscribe");

const createContractEvent$ = (options = {}) => {
  const { abi, address, newBlock$ } = options;
  if (!options.provider && !options.web3)
    throw new Error("A provider or web3 instance is required");
  if (!abi) throw new Error("The contract ABI is required");
  if (!address) throw new Error("The contract address is required");

  const web3 = options.provider ? new Web3(options.provider) : options.web3;
  const providerType = web3.currentProvider.constructor.name;

  // TODO: perhaps use get-contract-instance and user just passes the entire json artifact in
  const contract = new web3.eth.Contract(abi, address);

  // TODO: for subs, return sub so user can unsub
  // Events subscription only works with websocket provider
  if (providerType === "WebsocketProvider") {
    return fromSubscribe({ contract });
  }

  if (!newBlock$)
    throw new Error(
      "Must provide newBlock$ when using http provider with web3",
    );
  return fromPolling({ contract, newBlock$ });
};

module.exports = createContractEvent$;
