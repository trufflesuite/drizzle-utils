/* eslint-disable no-console */
const Web3 = require("web3");
const createNewBlock$ = require("./index");

const main = async () => {
  // const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
  const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider

  const { observable } = await createNewBlock$({ web3 });
  observable.subscribe(console.log);
};

main();
