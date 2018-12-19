const path = require("path");
const fs = require("fs");
const TruffleCompile = require("truffle-compile");

// promisify truffle-compile
const truffleCompile = (...args) =>
  new Promise(resolve => TruffleCompile(...args, (_, data) => resolve(data)));

const compile = async pathToFile => {
  const sourcePath = path.join(__dirname, pathToFile);

  const sources = {
    [sourcePath]: fs.readFileSync(sourcePath, { encoding: "utf8" }),
  };

  const options = {
    contracts_directory: path.join(__dirname),
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

  // get file names
  const sourceFilename = path.basename(sourcePath);
  const artifactFilename =
    sourceFilename.substr(0, sourceFilename.lastIndexOf(".")) + `.json`;

  // compile to artifact and stringify
  const artifact = await truffleCompile(sources, options);
  const artifactString = JSON.stringify(artifact, null, 4);

  // write artifact to file
  fs.writeFileSync(artifactFilename, artifactString, "utf8");
};

module.exports = compile;
