const _getAccounts = require("@drizzle-utils/get-accounts");
const _getContractInstance = require("@drizzle-utils/get-contract-instance");
const _createCurrentAccount$ = require("@drizzle-utils/current-account-stream");
const _createContractCall$ = require("@drizzle-utils/contract-call-stream");
const _createContractEvent$ = require("@drizzle-utils/contract-event-stream");
const _createContractState$ = require("@drizzle-utils/contract-state-stream");
const _createNewBlock$ = require("@drizzle-utils/new-block-stream");

const createDrizzleUtils = async ({ web3 }) => {
  const newBlock$ = _createNewBlock$({
    web3,
    pollingInterval: 200, // only used if non-WebsocketProvider
  });

  const currentAccount$ = await _createCurrentAccount$({ web3 });

  const getAccounts = async (options = {}) =>
    await _getAccounts({ web3, ...options });

  const getContractInstance = async (options = {}) =>
    await _getContractInstance({ web3, ...options });

  const createCurrentAccount$ = async (options = {}) =>
    await _createCurrentAccount$({ web3, ...options });

  const createCall$ = (options = {}) =>
    _createContractCall$({ web3, newBlock$, ...options });

  const createEvent$ = async (options = {}) => {
    if (options.artifact) {
      const { artifact } = options;
      const networkId = await web3.eth.net.getId();
      return _createContractEvent$({
        web3,
        newBlock$,
        abi: artifact.abi,
        address: artifact.networks[networkId].address,
        ...options,
      });
    }

    if (options.instance) {
      const { instance } = options;
      return _createContractEvent$({
        web3,
        newBlock$,
        abi: instance._jsonInterface,
        address: instance._address,
        ...options,
      });
    }

    return _createContractEvent$({ web3, newBlock$, ...options });
  };

  const createState$ = (options = {}) =>
    _createContractState$({
      newBlock$,
      provider: web3.currentProvider,
      ...options,
    });

  return {
    getAccounts,
    getContractInstance,
    createCurrentAccount$,
    createCall$,
    createEvent$,
    createState$,
    newBlock$,
    currentAccount$,
  };
};

module.exports = createDrizzleUtils;
