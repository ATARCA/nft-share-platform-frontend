import { ethers } from "ethers";
import { LikeERC721__factory } from "../typechain-types";
import { ShareableERC721__factory } from '../typechain-types/factories/ShareableERC721__factory'

export const loadShareContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = ShareableERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const loadLikeContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = LikeERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const deployContract = (provider: ethers.providers.Web3Provider) => {
    const factory = new ShareableERC721__factory().connect( provider.getSigner() )
    return factory.deploy('testName', 'testSymbol');

}