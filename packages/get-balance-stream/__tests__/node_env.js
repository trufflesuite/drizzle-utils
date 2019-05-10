/**
 * @jest-environment node
 */
const createNewBlock$ = require("@drizzle-utils/new-block-stream");
const initTestChain = require("@drizzle-utils/test-chain");
const { take, finalize, tap, toArray } = require("rxjs/operators");

const createBalanceStream$ = require("../index");

jest.setTimeout(20000);

describe("get-balance-stream tests in node environment", () => {
  let provider;
  let web3;
  let accounts;
  beforeAll(async () => {
    ({ provider, web3, accounts } = await initTestChain());
  });

  afterAll(async () => {
    provider.close();
  });

  test("createBalanceStream$ function exists", () => {
    expect(createBalanceStream$).toBeDefined();
  });

  test("createBalanceStream$ throws errors when required options fields not found", () => {
    const { observable: newBlock$ } = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    expect(() => createBalanceStream$()).toThrow();

    expect(() =>
      createBalanceStream$({
        newBlock$,
        web3,
      }),
    ).toThrow(new Error("The options object with address is required"));

    expect(() =>
      createBalanceStream$({ newBlock$, address: accounts[0] }),
    ).toThrow(new Error("The options object with web3 is required."));

    expect(() => createBalanceStream$({ web3, address: accounts[0] })).toThrow(
      new Error("The options object with newBlock$ is required"),
    );
  });

  test("can track balance of addresses", async done => {
    const { observable: newBlock$, cleanup } = createNewBlock$({
      web3,
      pollingInterval: 200,
    });

    const balance0$ = createBalanceStream$({
      web3,
      newBlock$,
      address: accounts[0],
    });
    const balance1$ = createBalanceStream$({
      web3,
      newBlock$,
      address: accounts[1],
    });

    balance0$
      .pipe(
        take(1),
        toArray(),
        // TODO Look at jest failure to find the actual value (gas depenednt)
        tap(vals => expect(vals).toEqual(["0"])),
        finalize(() => {
          expect.assertions(1);
          cleanup();
          done();
        }),
      )
      .subscribe();

    balance1$
      .pipe(
        take(1),
        toArray(),
        tap(vals => expect(vals).toEqual(["0"])),
        finalize(() => {
          expect.assertions(1);
          cleanup();
          done();
        }),
      )
      .subscribe();

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
  });
});
