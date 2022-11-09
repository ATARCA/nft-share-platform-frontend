import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import { Button, Card, Grid, Header, Input, Message, Segment } from "semantic-ui-react";
import { useIsCurrentAccountTokenOwner, useMetadata, useMintTokenAndUploadMetadata, useTokenDetails } from "../../hooks/hooks";
import { hooks } from "../../connectors/metaMaskConnector";
import { BigNumber } from "@ethersproject/bignumber";
import { subContributionPropertyName, subContributorPropertyName, MetadataAttribute, NFTMetadata } from "../../types/NFTMetadata";
import { TokenByIdQuery_token } from "../../queries-thegraph/types-thegraph/TokenByIdQuery";
import { TokenCard } from "../TokenGrid";
import { InputLabel } from "../InputForm/InputLabel";
import { InputLine } from "../InputForm/InputLine";
import { InputForm } from "../InputForm/InputForm";

const { useError, useIsActive } = hooks

const MAX_SUBCONTRIBUTION_TITLE_LENGTH = 64

const TokenSharePage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'

    const [ receiverName, setReceiverName ] = useState('')
    
    const [ subcontributionName, setSubcontributionName ] = useState('')
    const [ tokenDescription, setTokenDescription ] = useState('')

    const [ errorMessage, setErrorMessage ] = useState('')

    const [ detailedToken, detailedTokenLoading ] = useTokenDetails(contractAddress, BigNumber.from(tokenId))
    const isCurrentAccountTokenOwner = useIsCurrentAccountTokenOwner(detailedToken?.ownerAddress)

    const [ tokenDisplayName, tokenHolderDisplayName, currentTokenmetadata, consentMissing, metadataErrorMessage ] = useMetadata(detailedToken)

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
               
                const contributorAttribute:MetadataAttribute = {trait_type:subContributorPropertyName, value:receiverName}
                const contributionTitleAttribute:MetadataAttribute = {trait_type:subContributionPropertyName, value:subcontributionName}
               
                extendedMetadata.description = tokenDescription

                extendedMetadata.attributes.push(contributorAttribute)
                extendedMetadata.attributes.push(contributionTitleAttribute)
                const extendedMetadataJson = JSON.stringify(extendedMetadata, null, '\t')
                setNewMetadata(extendedMetadataJson)
                setIsMetadataValid( !!subcontributionName && !!tokenDescription && !!receiverName && subcontributionName.length<MAX_SUBCONTRIBUTION_TITLE_LENGTH) 
            }
        }

        updateNewTokenMetadata()
    },[currentTokenmetadata, receiverName, setIsMetadataValid, setNewMetadata, subcontributionName, tokenDescription])

    const shareDisabled = () => {
        return !canMint() || 
        !currentTokenmetadata ||
        mintAndMetadaUploadCompleted || !isCurrentAccountTokenOwner
    }

    const onMintAnotherTokenClicked = () => {
        setReceiverAddress('')
        setReceiverName('')
        setSubcontributionName('')
        setTokenDescription('')
        resetState()
    }

    const renderSuccessView = () => {
        return <div style={{ 'paddingBottom': '2em' }}>
            <p>Token minting transaction sent. Metadata upload successful.</p>
            <Button onClick={() => onMintAnotherTokenClicked()}>Mint another token</Button>
        </div>
    }
    const renderRightColumn = () => { 
        return <Grid.Column width={11}><div>
            { metamaskError ? <Message error header='Metamask error' content={metamaskError}/>: <></>}
            { errorMessage ? <Message error header='Transaction error' content={errorMessage}/>: <></>}
            {metadataErrorMessage ? <Message error header='Error when loading metadata' content={metadataErrorMessage}/> : <></>}

            { mintAndMetadaUploadCompleted ? <Message header='Thanks for sharing your award! Mint transaction was sent and your co-contributor details metadata were uploaded'/>: <></>}
    
            { (!isCurrentAccountTokenOwner && isActive) ? <Message warning header='Cannot share token' content='Current account is not owner of this token and cannot share it.'/>: <></>}

            <div style={{'textAlign': 'left', 'paddingBottom' : '3.75em'}}>
                <p>You can share your Community Award with other community members who have also participated in the same contribution, or helped you to make it possible. You can share the award with as many co-contributors as you wish. They will be able to share it further with their own co-contributors. </p>
                <p>When you share the award, a new award token is minted to the co-contributor with their award details (recipient’s name and award title). Your own award token will stay in your wallet, and the new recipient will have their token in their wallet. </p>
                <p>Share your award and give your acknowledgement and appreciation to those who have made your work possible!</p>
            </div>

            <InputForm>
                <InputLine>
                    <InputLabel label='Co-contributor’s wallet address'/>
                    <Input fluid 
                        disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                        value={receiverAddress} 
                        error={!isValidAddress && !!receiverAddress}
                        onChange={(e, { value }) => setReceiverAddress( value ) }/>
                </InputLine>

                <InputLine>
                    <InputLabel label='Name or username' subLabel="(as it will appear on the award token)"/>
                    <Input fluid 
                        disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                        value={receiverName} 
                        onChange={(e, { value }) => setReceiverName( value ) }/>
                </InputLine>

                <InputLine>
                    <InputLabel label='Title of sub-contribution' subLabel={`(max ${MAX_SUBCONTRIBUTION_TITLE_LENGTH} characters)`}/>
                    <Input fluid 
                        disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                        value={subcontributionName} 
                        onChange={(e, { value }) => setSubcontributionName( value ) }/>
                </InputLine>

                <InputLine>
                    <InputLabel label='Token description' subLabel={<p style={{maxWidth: '20em', whiteSpace: 'normal'}}>Visible on token detail page, e.g.{currentTokenmetadata?.description}</p>}/>
                    <Input fluid
                        disabled={mintInProgress || metadataSignAndUploadInProgress || mintAndMetadaUploadCompleted}
                        value={tokenDescription} 
                        onChange={(e, { value }) => setTokenDescription( value ) }/>
                </InputLine>
            </InputForm>

            <div style={{'paddingTop': '6.25em', 'paddingBottom': '8.75em'}}>

                { mintAndMetadaUploadCompleted 
                && mintErrorMessage === '' 
                && metadataUploadErrorMessage === '' ? renderSuccessView() : <></>}

                {metadaSignOrUploadFailed ?
                    <div>
                        <p>Metadata signing and uploading failed. Please try again to avoid having a minted token without metadata.</p>
                        <Button color='orange' onClick={() => retrySignAndUploadMetadata()} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={metadataSignAndUploadInProgress}>Retry metadata sign and upload</Button>
                    </div>:<></>}
                <Button primary 
                    disabled={ shareDisabled() } 
                    onClick={ onShareClicked } 
                    loading={ mintInProgress || metadataSignAndUploadInProgress }>Share award</Button>
            </div>
        </div>
        </Grid.Column>
    }

    const renderLeftColumn = (token:TokenByIdQuery_token) => {
        return <Grid.Column width={5} style={{'textAlign': 'left', 'paddingLeft':'0'}} >
            <TokenCard token={token} centered={false}/>
        </Grid.Column>
    }

    const renderTokenSharePage = (token:TokenByIdQuery_token) => {
        return <div style={{'margin': '0 10vw'}}>
            <Grid columns={2} style={{'margin': '3vh 0'}}>
                <Grid.Column style={{'textAlign': 'left'}} >
                    <Header.Subheader className="Page-subheader">Share award</Header.Subheader>
                    <Header className="No-overflow" as='h1'>{tokenDisplayName}</Header>
                </Grid.Column>
            </Grid>
            <div>
                <Grid columns={2} style={{'margin': '2vh 2vw'}}>
                    {renderLeftColumn(token)}
                    {renderRightColumn()}
                </Grid>
            </div>
        </div>
    }

    
    if (detailedTokenLoading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            detailedToken? renderTokenSharePage(detailedToken)
                :
                <div>
                    Token with id {tokenId} not found in contract {contractAddress}.
                </div>
        )
}

export default TokenSharePage