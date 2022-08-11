import { Button, Input, Message } from "semantic-ui-react";
import { ethers } from "ethers";
import React from "react";
import { hooks } from "../../connectors/metaMaskConnector";
import { useIsProjectOwner, useMintTokenAndUploadMetadata, useProjectDetails, useShareContract } from "../../hooks/hooks";
import { projectId, shareContractAddress } from "../../utils";
import { MetadataEntryForm } from "../MetadataEntryForm";

const { useAccounts, useIsActive, useProvider } = hooks

const MintPage = () => {

    const isActive = useIsActive()
    const [isProjectOwner, isProjectOwnerLoading] = useIsProjectOwner()
    const [projectDetails, projectDetailsLoading] = useProjectDetails(projectId)
   
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
        resetState ] = useMintTokenAndUploadMetadata( (receiverAddress, shareContract) => shareContract.mint(receiverAddress))

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
   
    if (isActive && !isProjectOwner) return <div>
        <Message warning> This wallet is not a project owner of this project. </Message>
        <p>Wallet {projectDetails?.owner} is the owner of this project.</p>
    </div>

    return (
        isActive? 
            renderContent()
            :
            <div className="margin-vertical margin-horizontal">
                <Message info> Connect your wallet to continue.</Message>
            </div>
    )
}

export default MintPage