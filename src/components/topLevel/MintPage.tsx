import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Input, Message } from "semantic-ui-react";
import { ethers } from "ethers";
import { hooks } from "../../connectors/metaMaskConnector";
import { loadShareContract } from "../../contracts/demoContract";
import { backendApolloClient } from "../../graphql/backendApolloClient";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { useMintTokenAndUploadMetadata, useShareContract } from "../../hooks/hooks";
import { ADD_PENDING_METADATA, GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD } from "../../queries-backend/queries";
import { AddPendingMetadataMutation, AddPendingMetadataMutationVariables } from "../../queries-backend/types-backend/AddPendingMetadataMutation";
import { GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables } from "../../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { ShareableERC721 } from "../../typechain-types";
import { shareContractAddress } from "../../utils";
import { MetadataEntryForm } from "../MetadataEntryForm";

const { useAccounts, useIsActive, useProvider } = hooks

const MintPage = () => {

    const isActive = useIsActive()
   
    const shareContract = useShareContract(shareContractAddress)
   
    const [ setMetadata, 
        isMetadataValid, 
        setIsMetadataValid, 
        receiverAddress, 
        setReceiverAddress, 
        canMint, 
        mintAndUploadMetadata, 
        mintInProgress, 
        metadaSignOrUploadFailed, 
        retrySignAndUploadMetadata, 
        metadataSignAndUploadInProgress, 
        mintAndMetadaUploadCompleted, 
        mintErrorMessage, 
        metadataUploadErrorMessage, 
        resetState ] = useMintTokenAndUploadMetadata()
        
    const isValidAddress = ethers.utils.isAddress(receiverAddress)

    const onMintAndUploadMetadataClicked = async () => {
        await mintAndUploadMetadata()
    }

    const renderRetryMetadataSignAndUpload = () => {
        return <div>
            {metadaSignOrUploadFailed ?
                <div>
                    <p>Metadata signing and uploading failed. Please try again to avoid having a minted token without metadata.</p>
                    <Button color='orange' onClick={() => retrySignAndUploadMetadata()} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={metadataSignAndUploadInProgress}>Retry metadata sign and upload</Button>
                </div>:<></>}
        </div>
    }

    const renderContent = () => {
        return <div className='top-level-page'>
            
            { mintAndMetadaUploadCompleted 
                && mintErrorMessage === '' 
                && metadataUploadErrorMessage === '' ? renderSuccessView() :
                <div>
                    <div>Contract deployed at {shareContract ? shareContract.address : '(loading)'}</div>
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