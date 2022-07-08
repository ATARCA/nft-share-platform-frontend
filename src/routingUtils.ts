import { BigNumber } from "@ethersproject/bignumber"

export const buildTokenDetailRoute = (contractAddress: string, tokenId: BigNumber) => {
    return `/token/${contractAddress}/${tokenId.toString()}`
}

export const buildTokenShareRoute = (contractAddress: string, tokenId: BigNumber) => {
    return `/shareToken/${contractAddress}/${tokenId.toString()}`
}