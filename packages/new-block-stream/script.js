const Web3 = require("web3");
const createContractData$ = require("./index");
// const getWeb3 = require("@drizzle-utils/get-web3");

String.prototype.hashCode = function() {
  var hash = 0,
    i = 0,
    len = this.length;
  while (i < len) {
    hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
  }
  return hash;
};

const main = async () => {
  const web3 = new Web3("ws://127.0.0.1:9545");
  // const web3 = new Web3("http://127.0.0.1:9545");
  createContractData$({ web3 });
};

main();
