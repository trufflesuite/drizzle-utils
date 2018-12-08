import React, { Component } from "react";
import getWeb3 from "@drizzle-utils/get-web3";
import getAccounts from "@drizzle-utils/get-accounts";

class App extends Component {
  state = { accounts: null };

  componentDidMount = async () => {
    const web3 = await getWeb3()

    try {
      const accounts = await getAccounts({ web3 });
      this.setState({ accounts });
    } catch (error) {
      console.error(error);
    }
  };

  renderAccounts() {
    const { accounts } = this.state;
    return (
      <>
        <p>Accounts [{accounts.length}]:</p>
        <ul>
          {accounts.map(address => (
            <li key={address}>{address}</li>
          ))}
        </ul>
      </>
    );
  }

  render() {
    const { accounts } = this.state;
    return (
      <div style={{ margin: "2em" }}>
        <h1>@drizzle-utils/get-accounts</h1>
        {accounts === null ? "Loading..." : this.renderAccounts()}
      </div>
    );
  }
}

export default App;
