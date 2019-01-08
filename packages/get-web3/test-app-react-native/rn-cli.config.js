const nodeLibs = require("node-libs-react-native");
nodeLibs.vm = require.resolve("vm-browserify");

module.exports = {
  resolver: {
    extraNodeModules: nodeLibs,
  },
  serializer: {
    // From https://github.com/facebook/react-native/blob/v0.57.7/rn-get-polyfills.js
    getPolyfills: () => [
      /**
       * We omit RN's Object.assign polyfill
       * If we don't, then node_modules will be using RN's polyfill rather than ours.
       */
      // require.resolve('react-native/Libraries/polyfills/Object.es6.js'),
      require.resolve("react-native/Libraries/polyfills/console.js"),
      require.resolve("react-native/Libraries/polyfills/error-guard.js"),
      require.resolve("react-native/Libraries/polyfills/Number.es6.js"),
      require.resolve(
        "react-native/Libraries/polyfills/String.prototype.es6.js",
      ),
      require.resolve(
        "react-native/Libraries/polyfills/Array.prototype.es6.js",
      ),
      require.resolve("react-native/Libraries/polyfills/Array.es6.js"),
      require.resolve("react-native/Libraries/polyfills/Object.es7.js"),
    ],
  },
};
