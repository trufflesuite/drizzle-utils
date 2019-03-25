# @drizzle-utils/contract-call-stream

A tool for streaming/listening to contract calls.

## Usage

You'll need to pass in the `newBlock$` that you can get from the `@drizzle-utils/new-block-stream` [package](../new-block-stream).

```js
import createContractCall$ from "@drizzle-utils/contract-call-stream";

const returnVal$ = createContractCall$({
  newBlock$,
  methodCall: contractInstance.methods.get(),
});
```
