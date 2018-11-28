const getWeb3 = require("@drizzle-utils/get-web3");
const getAccounts = require("@drizzle-utils/get-accounts");

class DrizzleUtils {
  constructor() {
    this.web3 = null;
    this.accounts = null;
  }

  onAccountChange(cb) {
    this.web3.currentProvider.publicConfigStore.on("update", async data => {
      const oldAccount = this.accounts[0].toLowerCase()
      const newAccount = data.selectedAddress.toLowerCase()
      if (oldAccount !== newAccount) {
        // prevent infinite loop by assigning new account to this.accounts
        // otherwise, getAccounts will trigger an update before it resolves
        this.accounts[0] = newAccount
        this.accounts = await getAccounts({ web3: this.web3 })
        cb(this.accounts)
      }
    });
  }

  init() {
    return new Promise(async resolve => {
      this.web3 = await getWeb3();
      this.accounts = await getAccounts({ web3: this.web3 });
      resolve();
    });
  }
}

module.exports = DrizzleUtils;
