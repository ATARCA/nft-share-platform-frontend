import { ethers } from "ethers";
import { LikeERC721__factory, ShareableERC721__factory } from "../typechain-types";

export const loadShareContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = ShareableERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const loadLikeContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = LikeERC721__factory.connect(address, provider.getSigner())

    return contract;
}