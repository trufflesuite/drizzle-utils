const getWeb3 = require("@drizzle-utils/get-web3");
const getAccounts = require("@drizzle-utils/get-accounts");
const getContractInstance = require("@drizzle-utils/get-contract-instance");
const createCurrentAccount$ = require("@drizzle-utils/current-account-stream");

class DrizzleUtils {
  constructor() {
    this.web3 = null;
    this.accounts = null;
    this.currentAccount$ = null;
    this.contractInstances = [];
  }

  async getAccounts() {
    this.accounts = await getAccounts({ web3: this.web3 });
    return this.accounts;
  }

  async getContractInstance(contractArtifact) {
    const instance = await getContractInstance({
      web3: this.web3,
      contractArtifact,
    });
    return instance;
  }

  async addContract(contractArtifact) {
    const instance = await this.getContractInstance(contractArtifact);
    this.contractInstances.push(instance);
    return instance;
  }

  async init() {
    this.web3 = await getWeb3();
    this.accounts = await getAccounts({ web3: this.web3 });
    this.currentAccount$ = await createCurrentAccount$({ web3: this.web3 });

    // keep `this.accounts` array up-to-date
    this.currentAccount$.subscribe(this.getAccounts.bind(this));
  }
}

module.exports = DrizzleUtils;
