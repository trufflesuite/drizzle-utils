const getWeb3 = require("@drizzle-utils/get-web3")
const getAccounts = require("@drizzle-utils/get-accounts")

class DrizzleUtils {
  web3 = null;
  accounts = null;

  constructor() {

  }

  init = async () => {
    this.web3 = await getWeb3()
    this.accounts = await getAccounts({ web3: this.web3 })
  }
}
