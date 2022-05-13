import { useLazyQuery, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button, Input, Message } from "semantic-ui-react";

import { hooks } from "../../connectors/metaMaskConnector";
import { loadContract } from "../../contracts/demoContract";
import { backendApolloClient } from "../../graphql/backendApolloClient";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD } from "../../queries-backend/queries";
import { GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables } from "../../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { GET_SHAREABLE_TOKEN } from "../../queries-thegraph/queries";
import { ShareableTokenQuery } from "../../queries-thegraph/types-thegraph/ShareableTokenQuery";
import { ShareableERC721 } from "../../typechain-types";
import { MetadataEntryForm } from "../MetadataEntryForm";


const { useAccounts, useIsActive, useProvider, useChainId } = hooks

const MintPage = () => {

    const isActive = useIsActive()
    const [ metadata, setMetadata ] = useState('')
    const [ isMetadataValid, setIsMetadataValid ] = useState(false)
    const [deployInProgress, setdeployInProgress] = useState(false)

    const [contract, setContract] = useState<ShareableERC721 | undefined>(undefined);
    const [ deployedContractAddress, setDeployedContractAddress ] = useState('')
    const [ receiverAddress, setReceiverAddress ] = useState('')
    const [ transactionHash, setTransactionHash ] = useState('')

    const [ nextShareId, setNextShareId ] = useState(1)
    const [ mintInProgress, setMintInProgress ] = useState(false)
    const [ metadataSignAndUploadInProgress, setMetadataSignAndUploadInProgress ] = useState(false)
    const [ metadaSignOrUploadFailed, setMetadaSignOrUploadFailed ] = useState(false)

    const allgraphShareTokensResult = useQuery<ShareableTokenQuery,undefined>(GET_SHAREABLE_TOKEN, {client: theGraphApolloClient, pollInterval: 5000});
    const shareableTokensCount = allgraphShareTokensResult.data?.shareableTokens.length

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ getMetadataToSign, _metadataToSign]  = useLazyQuery<GetMessageToSignForMetadataUploadQuery, 
     GetMessageToSignForMetadataUploadQueryVariables>
     (GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD,
         {client: backendApolloClient})

    const provider = useProvider();

    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect(() => {

        const loadGraphIndexedContract = async () => {
            if (provider) {
                setdeployInProgress(true)
                setErrorMessage('')
                try {
                    const contract  = loadContract('0x4381dBc9b27B035f87a04995400879Cd6e977AED', provider)
                    await contract.deployed()
                    const totalTokens = shareableTokensCount || 1
                    setNextShareId(totalTokens+2)//TODO for the new version of contract this will not be needed
                    setContract(contract)
                    setDeployedContractAddress(contract.address)
                } catch (error) {
                    console.log(error)
                    const message = (error as any)?.message
                    setErrorMessage(message)
                }
                setdeployInProgress(false)
            }
        }

        loadGraphIndexedContract()
    },[shareableTokensCount, provider])

    const mint = async () => {
        if (contract && isActive) {
            setMintInProgress(true)
            try {
                const resultTransaction = await contract.share(receiverAddress,'1', nextShareId)
                resultTransaction.wait().then( () => setMintInProgress(false))
                return resultTransaction
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
                setMintInProgress(false)
            }
        }
    }

    const signAndUploadMetadata = async (txHash: string) => {
        //TODO test retry after signing fails
        setMetadataSignAndUploadInProgress(true)
        setMetadaSignOrUploadFailed(false)

        try {
            const result = await getMetadataToSign({variables: {txHash: txHash, metadata: metadata}})
            const messageToSign = result.data?.getMetadataUploadMessageToSign
            if (messageToSign) {
                const signedMessage = await provider?.getSigner().signMessage(messageToSign)
                console.log('signed message', signedMessage)
                //next - upload metadata + query
            }
            else {
                console.error('Message to sign cannot be undefined')
            }
        } catch (error) {
            console.log(error)
            setMetadaSignOrUploadFailed(true)
            const message = (error as any)?.message
            setErrorMessage(message)
        }

        setMetadataSignAndUploadInProgress(false)
    }
    

    console.log('mint in progress', mintInProgress, 'metadataUploadInProgress', metadataSignAndUploadInProgress)

    const onMintAndUploadMetadataClicked = async () => {
        setErrorMessage('')
        const transaction = await mint()
       
        if (transaction) {
            setTransactionHash(transaction.hash)
            signAndUploadMetadata(transaction.hash)
        }
        else {
            console.error('Transaction is null')
        }

        const totalTokens = shareableTokensCount || 1
        setNextShareId(totalTokens+2)//TODO for the new version of contract this will not be needed
    }

    const canMint = () => {
        const isAddress = ethers.utils.isAddress(receiverAddress)
        return !mintInProgress 
        && !metadataSignAndUploadInProgress 
        && isActive 
        && isAddress 
        && isMetadataValid
        && contract
    }

    const renderRetryMetadataSignAndUpload = () => {
        return <div>
            {metadaSignOrUploadFailed ? <Button onClick={() => signAndUploadMetadata(transactionHash)} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={mintInProgress}>Retry metadata sign and upload</Button> :<></>}
        </div>
    }

    const renderContent = () => {
        return <div className='top-level-page'>
            <div>Contract deployed at {deployedContractAddress}</div>
            <MetadataEntryForm 
                onIsValid={(isValid) => setIsMetadataValid(isValid)}
                onMetadataChanged={(metadataNew) => setMetadata(metadataNew)}/>
            
            <div className='margin-vertical' >
                <Input fluid 
                    label='Token receiver' 
                    placeholder='address' 
                    value={receiverAddress} 
                    onChange={(e, { value }) => setReceiverAddress( value ) }/>
            </div>
            { errorMessage ? <Message error>
                <Message.Header>Error</Message.Header>
                <p>{errorMessage}</p>
            </Message> : <></>}
            <Button onClick={onMintAndUploadMetadataClicked} disabled={!canMint()} loading={mintInProgress}>Mint new token</Button>

        </div>
    }
   
    return (
        isActive? 
            renderContent()
            :
            <div>
                    Connect your wallet to continue.
            </div>
    )
}

export default MintPage