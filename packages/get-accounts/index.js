const getAccounts = options =>
  new Promise(async (resolve, reject) => {
    if (!options) {
      reject("The options object with web3 is required.");
    }
    const { web3, onChange } = options;
    try {
      // request account access if Metamask is detected
      if (window && window.ethereum) {
        await window.ethereum.enable();
      }

      // track account change with callback
      if (onChange) {
        web3.currentProvider.publicConfigStore.on("update", data =>
          onChange(data.selectedAddress)
        );
      }

      // resolve accounts
      const accounts = await web3.eth.getAccounts();
      resolve(accounts);
    } catch (err) {
      reject(err);
    }
  });

module.exports = getAccounts;
