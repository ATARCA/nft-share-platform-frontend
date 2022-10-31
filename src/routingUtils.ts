import { BigNumber } from "@ethersproject/bignumber"

export const buildTokenDetailRoute = (contractAddress: string, tokenId: BigNumber) => {
    return `/token/${contractAddress}/${tokenId.toString()}`
}

export const buildTokenShareRoute = (contractAddress: string, tokenId: BigNumber) => {
    return `/shareToken/${contractAddress}/${tokenId.toString()}`
}

export const buildWalletPageRoute = (address: string) => {
    return `/wallet/${address}`
}

export const buildProjectPageRoute = (projectId: string) => {
    return `/project/${projectId}`
}

export const aboutRoute = '/about'
export const mintRoute = '/mint'
export const manageConsentRoute = '/manageConsent'
export const projectRoute = 'project/:projectName'
export const tokenDetailRoute = 'token/:contractAddress/:tokenId'
export const tokenShareRoute = 'shareToken/:contractAddress/:tokenId'
export const walletDetailRoute = 'wallet/:walletAddress'
export const homeRoute = '/'
