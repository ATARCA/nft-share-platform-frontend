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
    if (!!address1 && !!address2) {
        return address1.toLowerCase() === address2.toLocaleLowerCase()
    }
    else return false
}

export const buildSubgraphTokenEntityId = (contractAddress: string, tokenId: BigNumber) => {
    return contractAddress.toLowerCase() + '-' + tokenId.toString()
}

export const likeContractAddress = '0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf'
export const shareContractAddress = '0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF'