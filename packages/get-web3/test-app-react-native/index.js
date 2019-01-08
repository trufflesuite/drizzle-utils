/** @format */
import "./shims";
import { AppRegistry } from "react-native";
import App from "./app/App";
import { name as appName } from "./app.json";

import React from "react";

AppRegistry.registerComponent(appName, () => () => <App />);
