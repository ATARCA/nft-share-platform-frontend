import type { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
}

const XDAI: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'xDai',
    symbol: 'xDAI',
    decimals: 18,
}

export interface BasicChainInformation {
  urls: (string | undefined)[]
  name: string
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
    chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
    const chainInformation = CHAINS[chainId]
    if (isExtendedChainInformation(chainInformation)) {
        return {
            chainId,
            chainName: chainInformation.name,
            nativeCurrency: chainInformation.nativeCurrency,
            rpcUrls: chainInformation.urls as string[],
            blockExplorerUrls: chainInformation.blockExplorerUrls,
        }
    } else {
        return chainId
    }
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
    1: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            process.env.alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyKey}` : undefined,
            'https://cloudflare-eth.com',
        ],
        name: 'Mainnet',
    },
    3: {
        urls: [process.env.REACT_APP_INFURA_DEV_KEY ? `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined],
        name: 'Ropsten',
    },
    4: {
        urls: [process.env.REACT_APP_INFURA_DEV_KEY ? `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined],
        name: 'Rinkeby',
    },
    5: {
        urls: [process.env.REACT_APP_INFURA_DEV_KEY ? `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined],
        name: 'Görli',
    },
    42: {
        urls: [process.env.REACT_APP_INFURA_DEV_KEY ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined],
        name: 'Kovan',
    },
    // Optimism
    10: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            'https://mainnet.optimism.io',
        ],
        name: 'Optimistic Ethereum',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
    },
    69: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://optimism-kovan.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            'https://kovan.optimism.io',
        ],
        name: 'Optimistic Kovan',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
    },
    // Arbitrum
    42161: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            'https://arb1.arbitrum.io/rpc',
        ],
        name: 'Arbitrum One',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://arbiscan.io'],
    },
    421611: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            'https://rinkeby.arbitrum.io/rpc',
        ],
        name: 'Arbitrum Testnet',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://testnet.arbiscan.io'],
    },
    // Polygon
    137: {
        urls: [
            process.env.REACT_APP_INFURA_DEV_KEY ? `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined,
            'https://polygon-rpc.com',
        ],
        name: 'Polygon Mainnet',
        nativeCurrency: MATIC,
        blockExplorerUrls: ['https://polygonscan.com'],
    },
    80001: {
        urls: [process.env.REACT_APP_INFURA_DEV_KEY ? `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURA_DEV_KEY}` : undefined],
        name: 'Polygon Mumbai',
        nativeCurrency: MATIC,
        blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    },
    100: {
        urls: ['https://rpc.gnosischain.com'],
        name: 'Gnosis Chain (formerly xDai)',
        nativeCurrency: XDAI,
        blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
    },
}

export const DESIRED_CHAIN_ID = Number(process.env.REACT_APP_DESIRED_CHAIN_ID || 100)

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce((accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls.filter((url) => url) as string[]

    if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs
    }

    return accumulator
}, {} as { [chainId: number]: string[] })