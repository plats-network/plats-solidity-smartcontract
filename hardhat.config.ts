import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
          }
        }
      }
    ]
  },
  networks: {
    evmos_testnet: {
      url: `https://eth.bd.evmos.dev:8545`,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 500000000,
    },
    // bsc_testnet: {
    //   url:"https://data-seed-prebsc-1-s2.binance.org:8545/",
    //   chainId: 97,
    //   accounts: 
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],

    // }
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};

export default config;
