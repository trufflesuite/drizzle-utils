const getAccounts = options =>
  new Promise((resolve, reject) => {
    if (!options) {
      reject("The options object with web3 is required.");
    }
    const { web3 } = options;
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        reject(error);
      }
    }
    const accounts = await web3.eth.getAccounts();
    resolve(accounts);
  });

module.exports = getAccounts;
