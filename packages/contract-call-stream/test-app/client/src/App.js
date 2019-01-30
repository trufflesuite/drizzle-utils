import React, { Component } from "react";
import Web3 from "web3";
import createNewBlock$ from "@drizzle-utils/new-block-stream";
import createContractCall$ from "@drizzle-utils/contract-call-stream";
import SimpleStorageContract from "./contracts/SimpleStorage.json";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      const web3 = new Web3("http://127.0.0.1:9545"); // HttpProvider
      // const web3 = new Web3("ws://127.0.0.1:9545"); // WebsocketProvider

      // track new blocks
      const { observable: newBlock$ } = await createNewBlock$({
        web3,
        pollingInterval: 200, // only used if non-WebsocketProvider
      });

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // create stream of values
      const value$ = createContractCall$({
        newBlock$,
        methodCall: instance.methods.get(),
      });

      value$.subscribe(val => this.setState({ storageValue: val }));

      // Set web3, accounts, contract, and value to the state
      const currentVal = await instance.methods.get().call();
      this.setState({ web3, accounts, contract: instance, storageValue: currentVal });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  increment = async () => {
    const { accounts, contract } = this.state;

    const currentVal = await contract.methods.get().call();
    const newVal = parseInt(currentVal, 10) + 1;

    await contract.methods.set(newVal).send({ from: accounts[0] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>The stored value is: {this.state.storageValue}</div>
        <button onClick={this.increment}>increment</button>
      </div>
    );
  }
}

export default App;
