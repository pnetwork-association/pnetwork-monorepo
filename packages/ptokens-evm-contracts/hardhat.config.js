require('dotenv').config()
require('hardhat-tracer')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')
require('hardhat-gas-reporter')
require('@nomicfoundation/hardhat-chai-matchers')
require('hardhat-spdx-license-identifier')
require('hardhat-log-remover')
require('solidity-coverage')
require('@nomicfoundation/hardhat-toolbox')
require('hardhat-tracer')
require('hardhat-change-network')

const fork1Config = require('./hardhat.config.fork1')
const fork2Config = require('./hardhat.config.fork2')

const getEnvironmentVariable = _envVar => process.env[_envVar] || ''

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
        },
      },
    },
  },
  networks: {
    fork1: {
      url: 'http://localhost:8545',
      chainId: fork1Config.networks.hardhat.chainId,
      accounts: [getEnvironmentVariable('TEST_PK')],
    },
    fork2: {
      url: 'http://localhost:8546',
      chainId: fork2Config.networks.hardhat.chainId,
      accounts: [getEnvironmentVariable('TEST_PK')],
    },
    mainnet: {
      chainId: 0x01,
      url: getEnvironmentVariable('MAINNET_NODE'),
      accounts: [getEnvironmentVariable('PK')],
      gasPrice: 20e9,
    },
    polygon: {
      chainId: 0x89,
      url: getEnvironmentVariable('POLYGON_NODE'),
      accounts: [getEnvironmentVariable('PK')],
      gasPrice: 400e9,
    },
    mumbai: {
      chainId: 80001,
      url: getEnvironmentVariable('MUMBAI_NODE'),
      accounts: [getEnvironmentVariable('PK')],
      gasPrice: 400e9,
    },
    bsc: {
      chainId: 0x38,
      url: getEnvironmentVariable('BSC_NODE'),
      accounts: [getEnvironmentVariable('PK')],
      gasPrice: 5e9,
    },
    sepolia: {
      chainId: 0xaa36a7,
      url: getEnvironmentVariable('SEPOLIA_NODE'),
      accounts: [getEnvironmentVariable('PK')],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: getEnvironmentVariable('ETHERSCAN_API_KEY'),
      polygon: getEnvironmentVariable('POLYGONSCAN_API_KEY'),
      mumbai: getEnvironmentVariable('POLYGONSCAN_API_KEY'),
    },
    customChains: [
      {
        network: 'polygon',
        chainId: 137,
        urls: {
          apiURL: 'https://api.polygonscan.com/api',
          browserURL: 'https://polygonscan.com',
        },
      },
      {
        network: 'sepolia',
        chainId: 11155111,
        urls: {
          apiURL: 'https://api.sepolia.etherscan.io/api',
          browserURL: 'https://sepolia.etherscan.io',
        },
      },
      {
        network: 'mumbai',
        chainId: 80001,
        urls: {
          apiURL: 'https://api-testnet.polygonscan.com/',
          browserURL: 'https://mumbai.polygonscan.com/',
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: false,
  },
  mocha: {
    timeout: 100000000,
  },
}

/**
 * User tasks
 */
require('./tasks')
