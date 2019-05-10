import React, { Component } from "react";
import Web3 from "web3";
import createNewBlock$ from "@drizzle-utils/new-block-stream";
import createBalanceStream$ from "@drizzle-utils/get-balance-stream";

import "./App.css";

class App extends Component {
  state = { balance0: 0, balance1: 0, web3: null, accounts: null };

  componentDidMount = async () => {
    try {
      const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
      // const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider

      // track new blocks
      const { observable: newBlock$ } = createNewBlock$({
        web3,
        pollingInterval: 200, // only used if non-WebsocketProvider
      });

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // create stream of values
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

      balance0$.subscribe(val => this.setState({ balance0: val }));
      const currentVal0 = await web3.eth.getBalance(accounts[0]);

      balance1$.subscribe(val => this.setState({ balance1: val }));
      const currentVal1 = await web3.eth.getBalance(accounts[1]);

      this.setState({
        web3,
        accounts,
        balance0: currentVal0,
        balance1: currentVal1,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  transfer = async () => {
    const { web3, accounts } = this.state;
    web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei(1),
    });
  };

  render() {
    const { web3, accounts, balance0, balance1 } = this.state;

    if (!web3) {
      return <div>Loading Web3 and accounts...</div>;
    }
    return (
      <div className="App">
        <div>
          Account 1 ({accounts[0]}): {balance0}
        </div>
        <div>
          Account 2 ({accounts[1]}): {balance1}
        </div>
        <button onClick={this.transfer}>
          Transfer 1 ETH from account 1 to 2
        </button>
      </div>
    );
  }
}

export default App;
