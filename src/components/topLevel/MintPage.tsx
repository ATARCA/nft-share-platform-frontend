import { useLazyQuery, useMutation } from "@apollo/client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button, Input, Message } from "semantic-ui-react";

import { hooks } from "../../connectors/metaMaskConnector";
import { loadShareContract } from "../../contracts/demoContract";
import { backendApolloClient } from "../../graphql/backendApolloClient";
import { ADD_PENDING_METADATA, GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD } from "../../queries-backend/queries";
import { AddPendingMetadataMutation, AddPendingMetadataMutationVariables } from "../../queries-backend/types-backend/AddPendingMetadataMutation";
import { GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables } from "../../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { ShareableERC721 } from "../../typechain-types";
import { MetadataEntryForm } from "../MetadataEntryForm";

const { useAccounts, useIsActive, useProvider } = hooks

const MintPage = () => {

    const isActive = useIsActive()
    const accounts = useAccounts()

    const [ metadata, setMetadata ] = useState('')
    const [ isMetadataValid, setIsMetadataValid ] = useState(false)

    const [contract, setContract] = useState<ShareableERC721 | undefined>(undefined);
    const [ deployedContractAddress, setDeployedContractAddress ] = useState('')
    const [ receiverAddress, setReceiverAddress ] = useState('')
    const isValidAddress = ethers.utils.isAddress(receiverAddress)

    const [ transactionHash, setTransactionHash ] = useState('')

    const [ mintInProgress, setMintInProgress ] = useState(false)
    const [ metadataSignAndUploadInProgress, setMetadataSignAndUploadInProgress ] = useState(false)
    const [ metadaSignOrUploadFailed, setMetadaSignOrUploadFailed ] = useState(false)

    const [ mintAndMetadaUploadCompleted, setMintAndMetadaUploadCompleted ] = useState(false)

    const [addPendingMetadataFunction, addPendingMetadataResult] = useMutation<AddPendingMetadataMutation, AddPendingMetadataMutationVariables>(ADD_PENDING_METADATA,  {client: backendApolloClient})

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ getMetadataToSign, _metadataToSign]  = useLazyQuery<GetMessageToSignForMetadataUploadQuery, 
     GetMessageToSignForMetadataUploadQueryVariables>
     (GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD,
         {client: backendApolloClient})

    const provider = useProvider();

    const [ mintErrorMessage, setMintErrorMessage ] = useState('')
    const [ metadataUploadErrorMessage, setMetadataUploadErrorMessage ] = useState('')

    useEffect(() => {

        const loadGraphIndexedContract = async () => {
            if (provider) {
                setMintErrorMessage('')
                try {
                    const contract  = loadShareContract('0x4381dBc9b27B035f87a04995400879Cd6e977AED', provider)
                    await contract.deployed()
                    setContract(contract)
                    setDeployedContractAddress(contract.address)
                } catch (error) {
                    console.log(error)
                    const message = (error as any)?.message
                    setMintErrorMessage(message)
                }
            }
        }

        loadGraphIndexedContract()
    },[ provider ])

    const mint = async () => {
        if (contract && isActive) {
            setMintErrorMessage('')
            setMintInProgress(true)
            try {
                const resultTransaction = await contract.share(receiverAddress,'1')
                resultTransaction.wait().then( () => setMintInProgress(false))
                return resultTransaction
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setMintErrorMessage(message)
                setMintInProgress(false)
            }
        }
    }

    const signAndUploadMetadata = async (txHash: string) => {
        setMetadataSignAndUploadInProgress(true)
        setMetadaSignOrUploadFailed(false)
        setMetadataUploadErrorMessage('')
        try {
            const result = await getMetadataToSign({variables: {txHash: txHash, metadata: metadata}})
            const messageToSign = result.data?.getMetadataUploadMessageToSign
            if (messageToSign && accounts) {
                const signingAddress = accounts[0]

                const signature = await provider?.getSigner().signMessage(messageToSign) || ''

                const metadataUploadResult = await addPendingMetadataFunction({variables: {pendingTxHash: txHash, metadata, signingAddress , signature}})
                if (metadataUploadResult.data?.addPendingMetadata.success) {
                    setMintAndMetadaUploadCompleted(true)
                }
                else {
                    setMetadaSignOrUploadFailed(true)
                    setMetadataUploadErrorMessage(metadataUploadResult.data?.addPendingMetadata.message || 'No errror message from failed metadata upload')
                }
            }
            else {
                console.error('Message to sign and account cannot be undefined')
                setMetadaSignOrUploadFailed(true)
            }
        } catch (error) {
            console.log(error)
            setMetadaSignOrUploadFailed(true)
            const message = (error as any)?.message
            setMetadataUploadErrorMessage(message)
        }

        setMetadataSignAndUploadInProgress(false)
    }
    
    const onMintAndUploadMetadataClicked = async () => {
        const transaction = await mint()
       
        if (transaction) {
            setTransactionHash(transaction.hash)
            signAndUploadMetadata(transaction.hash)
        }
        else {
            console.error('Transaction is null')
        }

    }

    const canMint = () => {
        return !mintInProgress 
        && !metadataSignAndUploadInProgress 
        && !metadaSignOrUploadFailed
        && isActive 
        && isValidAddress 
        && isMetadataValid
        && contract
    }

    const renderRetryMetadataSignAndUpload = () => {
        return <div>
            {metadaSignOrUploadFailed ?
                <div>
                    <p>Metadata signing and uploading failed. Please try again to avoid having a minted token without metadata.</p>
                    <Button color='orange' onClick={() => signAndUploadMetadata(transactionHash)} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={metadataSignAndUploadInProgress}>Retry metadata sign and upload</Button>
                </div>:<></>}
        </div>
    }

    const renderContent = () => {
        return <div className='top-level-page'>
            
            { mintAndMetadaUploadCompleted 
                && mintErrorMessage === '' 
                && metadataUploadErrorMessage === '' ? renderSuccessView() :
                <div>
                    <div>Contract deployed at {deployedContractAddress ? deployedContractAddress : '(loading)'}</div>
                    <MetadataEntryForm 
                        onIsValid={(isValid) => setIsMetadataValid(isValid)}
                        onMetadataChanged={(metadataNew) => setMetadata(metadataNew)}/>
            
                    <div className='margin-vertical' >
                        <Input fluid 
                            label='Token receiver' 
                            placeholder='address' 
                            value={receiverAddress} 
                            error={!isValidAddress && !!receiverAddress}
                            onChange={(e, { value }) => setReceiverAddress( value ) }/>
                    </div>
                    { mintErrorMessage ? 
                        <Message error header='Error while minting' content={mintErrorMessage}/>: <></>}
                    { metadataUploadErrorMessage ? 
                        <Message error header='Error while signing and uploading metadata' content={metadataUploadErrorMessage}/>: <></>}
                    {renderRetryMetadataSignAndUpload()}
                    <Button onClick={onMintAndUploadMetadataClicked} disabled={!canMint()} loading={mintInProgress}>Mint new token</Button>
                </div>
            }
        </div>
    }

    const resetState = () => {
        setMintAndMetadaUploadCompleted(false)
        setReceiverAddress('')
    }

    const renderSuccessView = () => {
        return <div>
            <p>Token minting transaction sent. Metadata upload successful.</p>
            <Button onClick={() => resetState()}>Mint another token</Button>
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