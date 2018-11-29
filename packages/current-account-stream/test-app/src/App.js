import React, { Component } from "react";
import getWeb3 from "@drizzle-utils/get-web3";
import createCurrentAccount$ from "@drizzle-utils/current-account-stream";

class App extends Component {
  state = { currentAccount: null };

  componentDidMount = async () => {
    const web3 = await getWeb3();
    const currentAccount$ = await createCurrentAccount$({ web3 });
    currentAccount$.subscribe(currentAccount =>
      this.setState({ currentAccount })
    );
  };

  render() {
    const { currentAccount } = this.state;
    if (!currentAccount) return "Loading...";
    return (
      <div style={{ margin: "2em" }}>
        <h1>@drizzle-utils/current-account-stream</h1>
        <p>
          <strong>Current Account:</strong> {currentAccount}
        </p>
      </div>
    );
  }
}

export default App;
