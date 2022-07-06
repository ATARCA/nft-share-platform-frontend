import { BigNumber } from "@ethersproject/bignumber";

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const shortenAccountAddress = (address: string) : string => {
    return address.substring(0,5) + '...' + address.substring(address.length - 4)
}

export const addressesEqual = (address1: string, address2: string): boolean => {
    return address1.toLowerCase() === address2.toLocaleLowerCase()
}

export const buildSubgraphTokenEntityId = (contractAddress: string, tokenId: BigNumber) => {
    return contractAddress.toLowerCase() + '-' + tokenId.toString()
}