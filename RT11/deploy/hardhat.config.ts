import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || ''
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || ''
const DEPLOYER_PK = process.env.DEPLOYER_PK || ''
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ''

const accounts = DEPLOYER_PK ? [DEPLOYER_PK] : []

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    amoy: {
      url: AMOY_RPC_URL,
      accounts,
      chainId: 80002,
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts,
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonAmoy: POLYGONSCAN_API_KEY,
    },
  },
}

export default config
