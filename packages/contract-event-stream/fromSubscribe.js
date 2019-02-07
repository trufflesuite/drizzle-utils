const { Subject } = require("rxjs");

const fromSubscribe = ({ contract }) => {
  const observable = new Subject();
  contract.events
    .allEvents()
    .on("data", event => {
      observable.next(event);
    })
    .on("error", err => observable.next(err));
  return observable;
};

module.exports = fromSubscribe;
