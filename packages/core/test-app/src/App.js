import React, { Component } from "react";
import DrizzleUtils from "@drizzle-utils/core";

class App extends Component {
  state = { loading: true, drizzleUtils: null, accounts: null };

  componentDidMount = async () => {
    const drizzleUtils = new DrizzleUtils();
    await drizzleUtils.init();

    drizzleUtils.onAccountChange(accounts => this.setState({ accounts }));

    this.setState({
      drizzleUtils,
      loading: false,
      accounts: drizzleUtils.accounts
    });

    console.log(drizzleUtils);
  };

  render() {
    return (
      <div style={{ margin: "2em" }}>
        <h1>@drizzle-utils/core</h1>
        {this.state.loading ? (
          "Loading..."
        ) : (
          <p>Account: {<span>{this.state.accounts}</span>}</p>
        )}
      </div>
    );
  }
}

export default App;
