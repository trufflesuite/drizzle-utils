const NodeEnvironment = require("jest-environment-node");

class ReactNativeEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.global.window = {};
    this.global.navigator = {
      product: "ReactNative",
    };
  }

  async teardown() {
    await super.teardown();
    this.global.window = undefined;
    this.global.navigator = undefined;
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = ReactNativeEnvironment;
