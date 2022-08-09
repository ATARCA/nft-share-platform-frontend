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

export const likeContractAddress = '0xc8F302f41a588Ac5B8c45269a1B001C572CB7AC1'
export const shareContractAddress = '0x4F494D371f71969140Bf03754C8be787c42BfA70'

export const factoryContractAddress = '0xb4CEA12BaF1529DFdE908016B81A2D668b321CDd'
export const projectId = 'Streamr'

