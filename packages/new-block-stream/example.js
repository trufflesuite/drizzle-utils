/* eslint-disable no-console */
const Web3 = require("web3");
const createNewBlock$ = require("./index");

const main = async () => {
  // const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
  const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider

  const { observable, subscription } = createNewBlock$({
    web3,
    pollingInterval: 200, // only used if non-WebsocketProvider
  });

  // log out new blocks (might skip blocks if polling)
  const stream = observable.subscribe(console.log);

  // 10 seconds later, unsubscribe
  setTimeout(() => {
    console.log("unsubscribing...");
    subscription.unsubscribe();
    stream.unsubscribe();
    process.exit();
  }, 10000);
};

main();
