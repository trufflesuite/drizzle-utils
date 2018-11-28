const getAccounts = options =>
  new Promise(async (resolve, reject) => {
    if (!options) {
      reject("The options object with web3 is required.");
    }
    const { web3 } = options;
    try {
      // request account access if Metamask is detected
      if (window && window.ethereum) {
        await window.ethereum.enable();
      }
      const accounts = await web3.eth.getAccounts();
      resolve(accounts);
    } catch (err) {
      reject(err);
    }
  });

module.exports = getAccounts;
