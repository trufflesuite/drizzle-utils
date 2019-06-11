const { Observable } = require("rxjs");

const fromSubscribe = ({ web3 }) => {
  const observable = new Observable(subscriber => {
    const subscription = web3.eth.subscribe(
      "newBlockHeaders",
      async (err, blockHeader) => {
        if (err) return subscriber.next(err);

        // get full block info with `web3.eth.getBlock`
        const block = await web3.eth.getBlock(blockHeader.number, true);
        subscriber.next(block);
      },
    );
    return subscription.unsubscribe;
  });

  return observable;
};

module.exports = fromSubscribe;
