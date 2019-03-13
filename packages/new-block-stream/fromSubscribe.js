const { Subject } = require("rxjs");

const fromSubscribe = ({ web3 }) => {
  const observable = new Subject();
  const subscription = web3.eth.subscribe(
    "newBlockHeaders",
    async (err, blockHeader) => {
      if (err) return observable.next(err);

      // get full block info with `web3.eth.getBlock`
      const block = await web3.eth.getBlock(blockHeader.number, true);
      observable.next(block);
    },
  );

  return {
    observable,
    subscription,
    cleanup: () => {
      subscription.unsubscribe();
    },
  };
};

module.exports = fromSubscribe;
