/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from 'semantic-ui-react'
import React, {  useState } from 'react'
import { hooks } from '../connectors/metaMaskConnector'
import { deployContract, loadLikeContract, loadShareContract } from '../contracts/demoContract';
import { ShareableERC721, ShareEvent } from '../typechain-types/ShareableERC721';
import { BigNumber } from '@ethersproject/bignumber';
import niftyInkContractABI from '../eventTestContract/Nifty.InkABI.json';

import { ethers } from 'ethers';
import { POLYGON_CHAIN_ID } from '../chains';
import { TokensQuery, TokensQueryVariables } from '../queries-thegraph/types-thegraph/TokensQuery';
import { GET_TOKENS } from '../queries-thegraph/queries';

import { useQuery } from '@apollo/client'
import { theGraphApolloClient } from '../graphql/theGraphApolloClient';
import { sleep } from '../utils';
import { LikeERC721 } from '../typechain-types';


const { useAccounts, useIsActive, useProvider, useChainId } = hooks

export const SendDemoTransaction = () => {

    const active = useIsActive();
    const provider = useProvider();
    const accounts = useAccounts();
    const chainId = useChainId()

    const [deployInProgress, setdeployInProgress] = useState(false)
    const [ mintInProgress, setMintInProgress ] = useState(false)
    const [ loadEventsInProgress, setLoadEventsInProgress ] = useState(false)
    const [ shareOrLikeInProgress, setShareOrLikeInProgress ] = useState(false)
    
    const [ deployedContractAddress, setDeployedContractAddress ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    
    const [shareContract, setShareContract] = useState<ShareableERC721 | undefined>(undefined);
    const [likeContract, setLikeContract] = useState<LikeERC721 | undefined>(undefined);

    const [ events, setEvents ] = useState<ShareEvent[] | undefined>(undefined)
    const [ aLotOfEvents, setALotOfEvents ] = useState<ethers.Event[] | undefined>(undefined)

    const [ nextShareId, setNextShareId ] = useState(1)

    const [ shareToAddress, setShareToAddress ] = useState('')

    const allgraphShareTokensResult = useQuery<TokensQuery,TokensQueryVariables>(GET_TOKENS, {client: theGraphApolloClient, pollInterval: 5000, variables: {isOriginal: true, isSharedInstance: false}});

    const onMintClicked = async () => {
        if (shareContract && accounts) {
            setMintInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await shareContract.mint(accounts[0])
                await resultTransaction.wait()
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setMintInProgress(false)
        }
    }

    const onShareClicked = async () => {
        if (shareContract && accounts) {
            setShareOrLikeInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await shareContract.share(shareToAddress,nextShareId)
                await resultTransaction.wait()
                setNextShareId(nextShareId+1)
                await sleep(2000)//cannot refetch the graph data immediately because they are not updated yet
                await allgraphShareTokensResult.refetch()
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setShareOrLikeInProgress(false)
        }
    }

    const onLikeClicked = async () => {
        if (likeContract && accounts) {
            setShareOrLikeInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await likeContract.mint(nextShareId)
                await resultTransaction.wait()
                setNextShareId(nextShareId+1)
                await sleep(2000)//cannot refetch the graph data immediately because they are not updated yet
                await allgraphShareTokensResult.refetch()
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setShareOrLikeInProgress(false)
        }
    }

    const onDeployClicked = async () => {
        if (provider) {
            setdeployInProgress(true)
            setErrorMessage('')
            try {
                const contract = await deployContract(provider)
                await contract.deployed()
                setNextShareId(3)
                setShareContract(contract)
                setDeployedContractAddress(contract.address)
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setdeployInProgress(false)
        }
    }

    const onLoadGraphIndexedShareContractClicked = async () => {
        if (provider) {
            setdeployInProgress(true)
            setErrorMessage('')
            try {
                const contract  = loadShareContract('0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF', provider)
                await contract.deployed()
                const totalTokens = allgraphShareTokensResult.data?.shareableTokens.length || 1
                setNextShareId(totalTokens+2)
                setShareContract(contract)
                setDeployedContractAddress(contract.address)
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setdeployInProgress(false)
        }
    }

    const onLoadGraphIndexedLikeContractClicked = async () => {
        if (provider) {
            setdeployInProgress(true)
            setErrorMessage('')
            try {
                const contract  = loadLikeContract('0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf', provider)
                await contract.deployed()
                const totalTokens = allgraphShareTokensResult.data?.shareableTokens.length || 1
                setNextShareId(totalTokens+2)
                setLikeContract(contract)
                setDeployedContractAddress(contract.address)
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setdeployInProgress(false)
        }
    }

    const onLoadEventsClicked = async () => {
        if (shareContract) {
            setLoadEventsInProgress(true)
            setErrorMessage('')
            const filter = shareContract.filters.Share()
            const result = await shareContract.queryFilter(filter)
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
            const events = await contract.queryFilter(filter, 15988323)
            console.log('events', events)

            setALotOfEvents(events)            
        }
        catch (error) {
            console.log(error)
            const message = (error as any)?.message
            setErrorMessage(message)
        }
        setLoadEventsInProgress(false)
    }

    return (
        <div>
            {errorMessage ? <div> Error {errorMessage}</div>: <></>}
            <Button onClick={onDeployClicked} disabled={!active} loading={deployInProgress}>Deploy new contract</Button>
            <Button onClick={onLoadGraphIndexedShareContractClicked} disabled={!active} loading={deployInProgress}>Load graph indexed Share contract</Button>
            <Button onClick={onLoadGraphIndexedLikeContractClicked} disabled={!active} loading={deployInProgress}>Load graph indexed Like contract</Button>

            <div>Contract deployed at {deployedContractAddress}</div>
            <div><Input label='Share to address' value={shareToAddress} onChange={(e, { value }) => setShareToAddress(value)}/></div>
            <div><Input label='Token ID to share' value={nextShareId} onChange={(e, { value }) => setNextShareId(Number.parseInt(value))}/></div>

            <Button onClick={onMintClicked} disabled={!active || !shareContract} loading={mintInProgress}>Mint new token</Button>
            <Button onClick={onShareClicked} disabled={!active || !shareContract} loading={shareOrLikeInProgress}>Share token, next ID {nextShareId}</Button>
            <Button onClick={onLikeClicked} disabled={!active || !likeContract} loading={shareOrLikeInProgress}>Like token, next ID {nextShareId}</Button>

            <Button onClick={onLoadEventsClicked} disabled={!active || !shareContract} loading={loadEventsInProgress}>Load contract share events</Button>
            <div>
                Share events
                {events?.map( e => <div key={e.event}>{e.args[0]} {e.args[1]} {(e.args[2] as BigNumber).toString()}</div>)}
            </div>

            <Button onClick={onLoadALotOfEventsClicked} disabled={!active || chainId !== POLYGON_CHAIN_ID} loading={loadEventsInProgress}>Load a lot of events (xDai only)</Button>
            
            <div>            
                Graph tokens/events size {allgraphShareTokensResult.data?.shareableTokens.length}
            </div>

            <div> 
             Graph tokens/events
            </div>

            {allgraphShareTokensResult.data?.shareableTokens.map( t => <div key={t.id}>{t.id} {t.ownerAddress}</div>)}

            A lot of events directly queried size {aLotOfEvents?.length}
            {aLotOfEvents?.map( e => <div key={e.transactionHash}>From {(e as any).args.from} To {(e as any).args.to}</div>)}

            <div>

            </div>
        </div>
    )
}