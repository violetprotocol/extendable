require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("./tasks");

require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
    },
    rinkeby: {
      url: `${process.env.NODE_URL}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
  tenderly: {
    username: `${process.env.TENDERLY_USERNAME}`,
    project: `${process.env.TENDERLY_PROJECT_NAME}`,
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
  },
};
