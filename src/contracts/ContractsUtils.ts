import { ethers } from "ethers";
import { LikeERC721__factory, ShareableERC721__factory, TalkoFactory__factory } from "../typechain-types";
import { factoryContractAddress } from "../utils";

export const loadShareContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = ShareableERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const loadLikeContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = LikeERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const deployContract = async (provider: ethers.providers.Web3Provider) => {
    const factoryContract = await TalkoFactory__factory.connect( factoryContractAddress, provider.getSigner() )
    const signerAddress = await provider.getSigner().getAddress()
    return await factoryContract.createShareableERC721Proxy("token name", "Symbol", signerAddress);
}