const path = require("path");
const fs = require("fs");
const TruffleCompile = require("truffle-compile");

// promisify truffle-compile
const truffleCompile = (...args) =>
  new Promise(resolve => TruffleCompile(...args, (_, data) => resolve(data)));

const compile = async filename => {
  const sourcePath = path.join(__dirname, "../contracts", filename);

  const sources = {
    [sourcePath]: fs.readFileSync(sourcePath, { encoding: "utf8" }),
  };

  const options = {
    contracts_directory: path.join(__dirname, "../contracts"),
    compilers: {
      solc: {
        version: "0.5.1",
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

  // generate new file path
  const artifactFilepath =
    sourcePath.substr(0, sourcePath.lastIndexOf(".")) + `.json`;

  // compile to artifact and stringify
  const artifact = await truffleCompile(sources, options);
  const artifactString = JSON.stringify(artifact, null, 4);

  // write artifact to file
  fs.writeFileSync(artifactFilepath, artifactString, "utf8");

  return artifact;
};

module.exports = compile;
