import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { ShareableERC721__factory } from '../typechain-types/factories/ShareableERC721__factory'

export const loadContract = (address: string, provider: ethers.providers.Web3Provider) => {
    const contract = ShareableERC721__factory.connect(address, provider.getSigner())

    return contract;
}

export const deployContract = (provider: ethers.providers.Web3Provider) => {
    const factory = new ShareableERC721__factory().connect( provider.getSigner() )
    return factory.deploy('testName', 'testSymbol');

}