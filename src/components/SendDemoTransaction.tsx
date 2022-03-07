import { Button } from 'semantic-ui-react'
import React, {  useState } from 'react'
import { hooks } from '../connectors/metaMaskConnector'
import { deployContract } from '../contracts/demoContract';
import { ShareableERC721, ShareEvent } from '../typechain-types/ShareableERC721';
import { BigNumber } from '@ethersproject/bignumber';
import niftyInkContractABI from '../eventTestContract/Nifty.InkABI.json';

import { ethers } from 'ethers';

const { useAccounts, useIsActive, useProvider, useChainId } = hooks

export const SendDemoTransaction = () => {

    const active = useIsActive();
    const provider = useProvider();
    const accounts = useAccounts();
    const chainId = useChainId()

    const [deployInProgress, setdeployInProgress] = useState(false)
    const [ mintInProgress, setMintInProgress ] = useState(false)
    const [ loadEventsInProgress, setLoadEventsInProgress ] = useState(false)
    const [ shareInProgress, setShareInProgress ] = useState(false)
    
    const [ deployedContractAddress, setDeployedContractAddress ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    
    const [contract, setContract] = useState<ShareableERC721 | undefined>(undefined);
    const [ events, setEvents ] = useState<ShareEvent[] | undefined>(undefined)
    const [ aLotOfEvents, setALotOfEvents ] = useState<ethers.Event[] | undefined>(undefined)


    const [ nextShareId, setNextShareId ] = useState(2)

    const onMintClicked = async () => {
        if (contract && accounts) {
            setMintInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await contract.mint(accounts[0],'1')
                await resultTransaction.wait()
            } catch (error) {
                console.log(error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setMintInProgress(false)
        }
    }

    const onShareClicked = async () => {
        if (contract && accounts) {
            setShareInProgress(true)
            setErrorMessage('')
            try {
                const demoShareDestinationAddress = '0xA86cb4378Cdbc327eF950789c81BcBcc3aa73D21'
                const resultTransaction = await contract.share(demoShareDestinationAddress,'1', nextShareId)
                await resultTransaction.wait()
                setNextShareId(nextShareId+1)
            } catch (error) {
                console.log(error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setShareInProgress(false)
        }
    }

    const onDeployClicked = async () => {
        if (provider) {
            setdeployInProgress(true)
            setErrorMessage('')
            try {
                const contract = await deployContract(provider)
                await contract.deployed()
                setContract(contract)
                setDeployedContractAddress(contract.address)
            } catch (error) {
                console.log(error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setdeployInProgress(false)
        }
    }

    const onLoadEventsClicked = async () => {
        if (contract) {
            setLoadEventsInProgress(true)
            setErrorMessage('')
            const filter = contract.filters.Share()
            const result = await contract.queryFilter(filter)
            setEvents(result)
            setLoadEventsInProgress(false)

        }
    }

    const onLoadALotOfEventsClicked = async () => {
        setLoadEventsInProgress(true)
        try {
            const contractAddress='0xCF964c89f509a8c0Ac36391c5460dF94B91daba5'
            const contract = new ethers.Contract(contractAddress,niftyInkContractABI, provider)

            const filter = contract.filters.Transfer()
            const events = await contract.queryFilter(filter)
            console.log('events', events)

            setALotOfEvents(events)            
        }
        catch (error) {
            console.log(error)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.message
            setErrorMessage(message)
        }
        setLoadEventsInProgress(false)
    }

    return (
        <div>
            {errorMessage ? <div> Error {errorMessage}</div>: <></>}
            <Button onClick={onDeployClicked} disabled={!active} loading={deployInProgress}>Deploy</Button>
            <div>Contract deployed at {deployedContractAddress}</div>
            <Button onClick={onMintClicked} disabled={!active || !contract} loading={mintInProgress}>Mint new token</Button>
            <Button onClick={onShareClicked} disabled={!active || !contract} loading={shareInProgress}>Share token, next ID {nextShareId}</Button>

            <Button onClick={onLoadEventsClicked} disabled={!active || !contract} loading={loadEventsInProgress}>Load contract share events</Button>
            <div>
                Share events
                {events?.map( e => <div key={e.event}>{e.args[0]} {e.args[1]} {(e.args[2] as BigNumber).toString()}</div>)}
            </div>

            <Button onClick={onLoadALotOfEventsClicked} disabled={!active || chainId !== 100} loading={loadEventsInProgress}>Load a lot of events (xDai only)</Button>
            A lot of events size {aLotOfEvents?.length}
            {aLotOfEvents?.map( e => <div key={e.transactionHash}>From {(e as any).args.from} To {(e as any).args.to}</div>)}

            <div>

            </div>
        </div>
    )
}