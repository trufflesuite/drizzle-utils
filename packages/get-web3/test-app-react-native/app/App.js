/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import getWeb3 from "@drizzle-utils/packages/get-web3";
import Web3 from "web3";

type Props = {};
export default class App extends Component<Props> {
  state = {
    beforeLoad: false,
    afterLoad: false,
    customProvider: false,
    fallbackProvider: false,
    metamaskInjection: false,
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

  componentDidMount() {
    this.testBeforeLoad();
    this.testAfterLoad();
    this.testCustomProvider();
    this.testFallbackProvider();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>@drizzle-utils/get-web3</Text>
        <Text>The environment is non-injected</Text>

        <View style={styles.testCases}>
          <Text>Tests for non-injected environments</Text>
          <View style={styles.testCase}>
            <Text>Call getWeb3() before page is done loading:</Text>
            <Text>{this.state.beforeLoad && "✅"}</Text>
          </View>

          <View style={styles.testCase}>
            <Text>Call getWeb3() after page is done loading:</Text>
            <Text>{this.state.afterLoad && "✅"}</Text>
          </View>

          <View style={styles.testCase}>
            <Text>Call getWeb3() with customProvider option:</Text>
            <Text>{this.state.customProvider && "✅"}</Text>
          </View>

          <View style={styles.testCase}>
            <Text>Call getWeb3() with fallbackProvider option:</Text>
            <Text>{this.state.fallbackProvider && "✅"}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  testCases: {
    marginTop: 10,
  },
  testCase: {
    flexDirection: "row",
  },
});
