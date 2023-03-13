import { BigNumber } from "@ethersproject/bignumber";
import React from "react";


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

export const isAValidUrl = (url?: string) => {
    if (url == null) return false
    
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

export const getUrlLinkElement = (url: string): React.ReactNode => {
    return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
}

export const streamrProjectId = 'Streamr'
export const atarcaProjectId = 'ATARCA EU'

