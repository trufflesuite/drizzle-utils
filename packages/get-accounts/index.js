const getAccounts = options =>
  new Promise(async (resolve, reject) => {
    if (!options || !options.web3) {
      return reject(new Error("The options object with web3 is required."));
    }
    const { web3 } = options;
    try {
      // request account access if Metamask is detected
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.enable();
      }

      // resolve accounts
      const accounts = await web3.eth.getAccounts();
      return resolve(accounts);
    } catch (err) {
      return reject(err);
    }
  });

module.exports = getAccounts;
