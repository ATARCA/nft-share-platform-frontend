import { Button } from 'semantic-ui-react'
import React, {  useState } from 'react'
import { hooks } from '../connectors/metaMaskConnector'
import { deployContract } from '../contracts/demoContract';
import { ShareableERC721 } from '../typechain-types/ShareableERC721';

const { useAccounts, useIsActive, useProvider } = hooks

export const SendDemoTransaction = () => {

    const active = useIsActive();
    const provider = useProvider();
    const accounts = useAccounts();

    const [deploying, setdeploying] = useState(false)
    const [ minting, setMinting ] = useState(false)
    
    const [ deployedContractAddress, setDeployedContractAddress ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    
    const [contract, setContract] = useState<ShareableERC721 | undefined>(undefined);

    const onMintClicked = async () => {
        if (contract && accounts) {
            setMinting(true)
            const resultTransaction = await contract.mint(accounts[0],'1')
            console.log('mint transaction')
            await resultTransaction.wait()
            console.log('mint transaction 2nd wait')
            setMinting(false)
        }
    }

    const onDeployClicked = async () => {
        if (provider) {
            setdeploying(true)
            try {
                const contract = await deployContract(provider)
                console.log('deploy transaction')
                await contract.deployed()
                console.log('deploy transaction 2nd wait')
                setContract(contract)
                setDeployedContractAddress(contract.address)
            } catch (error) {
                console.log(error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setdeploying(false)
        }
    }

    return (
        <div>
            {errorMessage ? <div> Error {errorMessage}</div>: <></>}
            <Button onClick={onDeployClicked} disabled={!active} loading={deploying}>Deploy</Button>
            <div>Contract deployed at {deployedContractAddress}</div>
            <Button onClick={onMintClicked} disabled={!active || !contract}loading={minting}>Mint new token</Button>
        </div>
    )
}