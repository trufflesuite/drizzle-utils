const _getAccounts = require("@drizzle-utils/get-accounts");
const _getContractInstance = require("@drizzle-utils/get-contract-instance");
const _createCurrentAccount$ = require("@drizzle-utils/current-account-stream");

const createDrizzleUtils = async ({ web3 }) => {
  const getAccounts = async (options = {}) =>
    await _getAccounts({ web3, ...options });

  const getContractInstance = async (options = {}) =>
    await _getContractInstance({ web3, ...options });

  const createCurrentAccount$ = async options =>
    await _createCurrentAccount$({ web3, ...options });

  return {
    getAccounts,
    getContractInstance,
    createCurrentAccount$,
  };
};

module.exports = createDrizzleUtils;
