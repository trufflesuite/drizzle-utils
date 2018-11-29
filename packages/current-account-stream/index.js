import { Observable } from "rxjs";
// import {
//   distinctUntilChanged,
//   withLatestFrom,
//   filter,
//   map,
//   shareReplay
// } from "rxjs/operators";

const createAccountChange$ = options =>
  new Promise((resolve, reject) => {
    if (!options || !options.web3) {
      reject("The options object with web3 is required.");
    }
    const { web3 } = options;

  });

module.exports = createAccountChange$;
