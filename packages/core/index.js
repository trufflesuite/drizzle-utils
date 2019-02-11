const _getAccounts = require("@drizzle-utils/get-accounts");
const _getContractInstance = require("@drizzle-utils/get-contract-instance");
const _createCurrentAccount$ = require("@drizzle-utils/current-account-stream");
const _createContractCall$ = require("@drizzle-utils/contract-call-stream");
const _createContractEvent$ = require("@drizzle-utils/contract-event-stream");
const _createContractState$ = require("@drizzle-utils/contract-state-stream");
const _createNewBlock$ = require("@drizzle-utils/new-block-stream");

const createDrizzleUtils = async ({ web3 }) => {
  const { observable: newBlock$ } = _createNewBlock$({
    web3,
    pollingInterval: 200, // only used if non-WebsocketProvider
  });

  const getAccounts = async (options = {}) =>
    await _getAccounts({ web3, ...options });

  const getContractInstance = async (options = {}) =>
    await _getContractInstance({ web3, ...options });

  const createCurrentAccount$ = async (options = {}) =>
    await _createCurrentAccount$({ web3, ...options });

  const createContractCall$ = (options = {}) =>
    _createContractCall$({ web3, newBlock$, ...options });

  const createContractEvent$ = (options = {}) =>
    _createContractEvent$({ web3, newBlock$, ...options });

  const createContractState$ = (options = {}) =>
    _createContractState$({ web3, newBlock$, ...options });

  return {
    getAccounts,
    getContractInstance,
    createCurrentAccount$,
    createContractCall$,
    createContractEvent$,
    createContractState$,
    newBlock$,
  };
};

module.exports = createDrizzleUtils;
