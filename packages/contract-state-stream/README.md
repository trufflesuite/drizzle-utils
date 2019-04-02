# @drizzle-utils/contract-state-stream

A tool for streaming/listening to contract state.

## Usage

You'll need to pass in the `newBlock$` that you can get from the `@drizzle-utils/new-block-stream` [package](../new-block-stream).

```js
import createContractState$ from "@drizzle-utils/contract-state-stream";

const state$ = createContractState$({
  newBlock$,  // from @drizzle-utils/new-block-stream package
  artifact,   // Truffle JSON artifact w/ AST
  provider,   // any valid Ethereum provider
});
```
