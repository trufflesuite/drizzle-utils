import React, { Component } from "react";
import Web3 from "web3";
import getWeb3 from "@drizzle-utils/get-web3";

class App extends Component {
  state = {
    beforeLoad: false,
    afterLoad: false,
    customProvider: false,
    fallbackProvider: false,
    metamaskInjection: false
  };

  testBeforeLoad = async () => {
    const web3 = await getWeb3();
    if (web3) this.setState({ beforeLoad: true });
  };

  testAfterLoad = async () => {
    setTimeout(async () => {
      const web3 = await getWeb3();
      if (web3) this.setState({ afterLoad: true });
    }, 2000);
  };

  testCustomProvider = async () => {
    const host = "http://127.0.0.1:1111";
    const customProvider = new Web3.providers.HttpProvider(host);

    const web3 = await getWeb3({ customProvider });
    if (web3 && web3.currentProvider.host === host) {
      this.setState({ customProvider: true });
    }
  };

  testFallbackProvider = async () => {
    const host = "http://127.0.0.1:2222";
    const fallbackProvider = new Web3.providers.HttpProvider(host);

    const web3 = await getWeb3({ fallbackProvider });
    if (
      web3 &&
      web3.currentProvider.host === host &&
      web3.givenProvider === null
    ) {
      this.setState({ fallbackProvider: true });
    }
  };

  testMetaMaskInjection = async () => {
    const web3 = await getWeb3();
    if (web3 && web3.currentProvider && web3.currentProvider._metamask) {
      this.setState({ metamaskInjection: true });
    }
  };

  componentDidMount() {
    this.testBeforeLoad();
    this.testAfterLoad();
    this.testCustomProvider();
    if (window.ethereum || window.web3) {
      this.testMetaMaskInjection();
    } else {
      this.testFallbackProvider();
    }
  }

  render() {
    const injectedEnv = window.ethereum || window.web3;
    const envMessage = injectedEnv
      ? "Please also test in a non-injected environment (i.e. no MetaMask)."
      : "Please also test in an injected environment (i.e. with MetaMask).";
    return (
      <div style={{ margin: "2em" }}>
        <h1>@drizzle-utils/get-web3</h1>
        <p>
          This environment is{" "}
          <strong>{injectedEnv ? "injected" : "non-injected"}</strong>
        </p>
        <p>{envMessage}</p>
        <h2>
          Tests for {injectedEnv ? "injected" : "non-injected"} environments
        </h2>
        <p>
          <strong>Call getWeb3() before page is done loading: </strong>
          <span>{this.state.beforeLoad && "✅"}</span>
        </p>
        <p>
          <strong>Call getWeb3() after page is done loading: </strong>
          <span>{this.state.afterLoad && "✅"}</span>
        </p>
        <p>
          <strong>Call getWeb3() with customProvider option: </strong>
          <span>{this.state.customProvider && "✅"}</span>
        </p>
        {injectedEnv ? (
          <p>
            <strong>
              Call getWeb3() in environment with MetaMask injection:{" "}
            </strong>
            <span>{this.state.metamaskInjection && "✅"}</span>
          </p>
        ) : (
          <p>
            <strong>Call getWeb3() with fallbackProvider option: </strong>
            <span>{this.state.fallbackProvider && "✅"}</span>
          </p>
        )}
      </div>
    );
  }
}

export default App;
