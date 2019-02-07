import React, { Component } from "react";
import Web3 from "web3";
import createContractEvent$ from "@drizzle-utils/contract-event-stream";
import createNewBlock$ from "@drizzle-utils/new-block-stream";
import TutorialTokenContract from "./contracts/TutorialToken.json";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
      const { observable: newBlock$ } = createNewBlock$({
        web3,
        pollingInterval: 200,
      });

      // const web3 = new Web3("ws://127.0.0.1:9545"); // event subs only work with WebsocketProvider

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TutorialTokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TutorialTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // create stream of contract state values
      const event$ = createContractEvent$({
        web3,
        abi: TutorialTokenContract.abi,
        address: deployedNetwork && deployedNetwork.address,
        newBlock$,
      });

      event$.subscribe(console.log);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      await this.updateBalanceOf();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateBalanceOf = async () => {
    const { contract, accounts } = this.state;
    const [account1Bal, account2Bal] = await Promise.all([
      contract.methods.balanceOf(accounts[0]).call(),
      contract.methods.balanceOf(accounts[1]).call(),
    ]);
    this.setState({ account1Bal, account2Bal });
  };

  transfer = async () => {
    const { contract, accounts } = this.state;
    await contract.methods.transfer(accounts[1], 1).send({ from: accounts[0] });
    await this.updateBalanceOf();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>Transfer some TutorialToken (TT) from Acccount 1 to Account 2.</p>
        <h2>TT balance</h2>
        <div>Account 1: {this.state.account1Bal}</div>
        <div>Account 2: {this.state.account2Bal}</div>
        <button onClick={this.transfer}>Transfer</button>
      </div>
    );
  }
}

export default App;
