import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import { Button, Input, Message } from "semantic-ui-react";
import { useIsCurrentAccountTokenOwner, useMetadata, useMintTokenAndUploadMetadata, useShareContract, useTokenDetails } from "../../hooks/hooks";
import { shareContractAddress } from "../../utils";
import { hooks } from "../../connectors/metaMaskConnector";
import { BigNumber } from "@ethersproject/bignumber";
import { subContributionTraitType, subContributorTraitType, MetadataAttribute, NFTMetadata } from "../../types/NFTMetadata";

const { useError, useIsActive } = hooks

const TokenSharePage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'

    const [ receiverName, setReceiverName ] = useState('')
    
    const [ subcontributionName, setSubcontributionName ] = useState('')

    const [ errorMessage, setErrorMessage ] = useState('')

    const [ detailedToken, detailedTokenLoading ] = useTokenDetails(contractAddress, BigNumber.from(tokenId))
    const isCurrentAccountTokenOwner = useIsCurrentAccountTokenOwner(detailedToken?.ownerAddress)

    const [ currentTokenmetadata, consentMissing, metadataErrorMessage ] = useMetadata(contractAddress, tokenId)

    const [ setNewMetadata, 
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
        resetState ] = useMintTokenAndUploadMetadata( (receiverAddress, shareContract) => shareContract.share(receiverAddress,tokenId))
    
    const isValidAddress = ethers.utils.isAddress(receiverAddress)

    console.log('detailedToken',detailedToken)

    const isActive = useIsActive()

    const metamaskError = useError()

    const onShareClicked = async () => {
        mintAndUploadMetadata()
    }

  
    useEffect(() => {
        const updateNewTokenMetadata = () => {
            if (currentTokenmetadata) {
                const extendedMetadata = { ...currentTokenmetadata}
                extendedMetadata.attributes = currentTokenmetadata.attributes.map( obj => ({...obj}))
               
                const contributorAttribute:MetadataAttribute = {trait_type:subContributorTraitType, value:receiverName}
                const contributionTitleAttribute:MetadataAttribute = {trait_type:subContributionTraitType, value:subcontributionName}
               
                extendedMetadata.attributes.push(contributorAttribute)
                extendedMetadata.attributes.push(contributionTitleAttribute)
                const extendedMetadataJson = JSON.stringify(extendedMetadata, null, '\t')
                setNewMetadata(extendedMetadataJson)
                setIsMetadataValid( !!subcontributionName && !!receiverName)
            }
        }

        updateNewTokenMetadata()
    },[currentTokenmetadata, receiverName, setIsMetadataValid, setNewMetadata, subcontributionName])

    const shareDisabled = () => {
        return !canMint() || 
        !currentTokenmetadata ||
        mintAndMetadaUploadCompleted
    }

    const onMintAnotherTokenClicked = () => {
        setReceiverAddress('')
        setReceiverName('')
        setSubcontributionName('')
        resetState()
    }

    const renderSuccessView = () => {
        return <div>
            <p>Token minting transaction sent. Metadata upload successful.</p>
            <Button onClick={() => onMintAnotherTokenClicked()}>Mint another token</Button>
        </div>
    }

    return <div>
        { metamaskError ? <Message error header='Metamask error' content={metamaskError}/>: <></>}
        { errorMessage ? <Message error header='Transaction error' content={errorMessage}/>: <></>}
        {metadataErrorMessage ? <Message error header='Error when loading metadata' content={metadataErrorMessage}/> : <></>}

        { mintAndMetadaUploadCompleted ? <Message header='Thanks for sharing your award! A new award token has been minted to your co-contributor with the given details.'/>: <></>}
    
        Token Share page tokenId {tokenId} contractAddress {contractAddress}

        { (!isCurrentAccountTokenOwner && isActive) ? <Message warning header='Cannot share token' content='Current account is not owner of this token and cannot share it.'/>: <></>}

        <div className='margin-vertical' >
            <Input fluid 
                label='Token receiver' 
                placeholder='address' 
                disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                value={receiverAddress} 
                error={!isValidAddress && !!receiverAddress}
                onChange={(e, { value }) => setReceiverAddress( value ) }/>
        </div>

        <div className='margin-vertical' >
            <Input fluid 
                label='Co-contributor' 
                placeholder='name or username' 
                disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                value={receiverName} 
                onChange={(e, { value }) => setReceiverName( value ) }/>
        </div>

        <div className='margin-vertical' >
            <Input fluid 
                label='Title of sub-contribution' 
                placeholder='token title' 
                disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                value={subcontributionName} 
                onChange={(e, { value }) => setSubcontributionName( value ) }/>
        </div>

        <Button primary 
            disabled={ shareDisabled() } 
            onClick={ onShareClicked } 
            loading={ mintInProgress || metadataSignAndUploadInProgress }>Share award</Button>

        { mintAndMetadaUploadCompleted 
                && mintErrorMessage === '' 
                && metadataUploadErrorMessage === '' ? renderSuccessView() : <></>}

        {metadaSignOrUploadFailed ?
            <div>
                <p>Metadata signing and uploading failed. Please try again to avoid having a minted token without metadata.</p>
                <Button color='orange' onClick={() => retrySignAndUploadMetadata()} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={metadataSignAndUploadInProgress}>Retry metadata sign and upload</Button>
            </div>:<></>}
    </div>
}

export default TokenSharePage