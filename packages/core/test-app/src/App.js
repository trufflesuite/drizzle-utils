import React, { Component } from "react";
import DrizzleUtils from "@drizzle-utils/core";

class App extends Component {
  state = {
    loading: true,
    drizzleUtils: null,
    currentAccount: null
  };

  componentDidMount = async () => {
    const drizzleUtils = new DrizzleUtils();
    await drizzleUtils.init();

    this.setState({ drizzleUtils, loading: false });

    drizzleUtils.currentAccount$.subscribe(addr =>
      this.setState({ currentAccount: addr })
    );
  };

  render() {
    const { loading, currentAccount } = this.state;
    if (loading) return "Loading...";
    return (
      <div style={{ margin: "2em" }}>
        <h1>@drizzle-utils/core</h1>
        <p>Current selected account: {currentAccount}</p>
      </div>
    );
  }
}

export default App;
