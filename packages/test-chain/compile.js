const path = require("path");
const fs = require("fs");
const TruffleCompile = require("truffle-compile");

// Promisify truffle-compile
const truffleCompile = (...args) =>
  new Promise(resolve => TruffleCompile(...args, (_, data) => resolve(data)));

const compile = async ({ dirname, filename }) => {
  const sourcePath = path.join(dirname, "contracts", filename);

  const sources = {
    [sourcePath]: fs.readFileSync(sourcePath, { encoding: "utf8" }),
  };

  const options = {
    contracts_directory: path.join(dirname, "contracts"),
    compilers: {
      solc: {
        version: "0.5.2",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
          evmVersion: "byzantium",
        },
      },
    },
  };

  const artifact = await truffleCompile(sources, options);
  return artifact;
};

module.exports = compile;
