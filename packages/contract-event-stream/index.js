const createStream = require("./createStream");

const createContractEvent$ = (options = {}) => {
  const { web3, abi, address, newBlock$ } = options;
  if (!web3) throw new Error("The options object with web3 is required");
  if (!abi) throw new Error("The options object with contract abi is required");
  if (!address)
    throw new Error("The options object with contract address is required");

  // TODO: perhaps use get-contract-instance and user just passes the entire json artifact in
  const contract = new web3.eth.Contract(abi, address);

  if (!newBlock$)
    throw new Error(
      "Must provide newBlock$ when using http provider with web3",
    );

  return createStream({ contract, newBlock$ });
};

module.exports = createContractEvent$;
