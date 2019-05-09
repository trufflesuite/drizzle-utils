# @drizzle-utils/get-balance-stream

A tool for streaming/listening to address balances.

## Usage

You'll need to pass in the `newBlock$` that you can get from the `@drizzle-utils/new-block-stream` [package](../new-block-stream).

```js
import createBalanceStream$ from "@drizzle-utils/get-balance-stream";

const returnVal$ = createBalanceStream$({
  web3,
  newBlock$,
  address: "myaddress",
});
```
