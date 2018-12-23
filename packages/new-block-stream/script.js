const Web3 = require("web3");
const createContractData$ = require("./index");
// const getWeb3 = require("@drizzle-utils/get-web3");

const main = async () => {
  const web3 = new Web3("ws://127.0.0.1:9545");
  // const web3 = new Web3("http://127.0.0.1:9545");
  createContractData$({ web3 });
};

main();
