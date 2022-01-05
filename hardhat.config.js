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
      url: "https://eth-rinkeby.alchemyapi.io/v2/UuiPY5yrnxf3Yi3aUrejN16cL9PH4byw",
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
  tenderly: {
    username: "papasmurf",
    project: "project",
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
  },
};
