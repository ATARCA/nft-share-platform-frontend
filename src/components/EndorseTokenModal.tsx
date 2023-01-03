import React, {useEffect, useState} from "react";
import {Button, Modal, Message, Header, TextArea, Form} from "semantic-ui-react";
import { hooks } from "../connectors/metaMaskConnector";
import { useCanCurrentAccountEndorse, useCurrentProjectId, useEndorseContract, useMetadata, useMintTokenAndUploadMetadata } from "../hooks/hooks";
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { endorsementTokenName, MetadataAttribute, originalTokenId } from "../types/NFTMetadata";

const { useAccounts } = hooks

const MAX_ENDORSMENT_LENGTH = 200
const MIN_ENDORSEMENT_LENGTH = 5

const EndorseTokenModal = ( {open, setOpen, originalToken} : { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, originalToken: TokenByIdQuery_token }) => {
    const [endorsementText, setEndorsementText] = useState('')
    const [endorsementTextEverChanged, setEndorsementTextEverChanged] = useState(false)

    const accounts = useAccounts()


    const projectId = useCurrentProjectId() || 'N/A'
    const [ tokenDisplayName, tokenHolderDisplayName, currentTokenmetadata, consentMissing, metadataErrorMessage ] = useMetadata(originalToken)
    const endorseContract = useEndorseContract(projectId)
    const canEndorse = useCanCurrentAccountEndorse(originalToken)

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
        resetState ] = useMintTokenAndUploadMetadata( projectId, (receiverAddress, shareContract, endorseContract) => { 
      
        if (endorseContract) { 
            return endorseContract.mint(originalToken.tokenId) } 
        else { throw new Error('endorseContract undefined')}})

    useEffect(() => {
        const updateReceiverAddress = () => {
            if (accounts)
                setReceiverAddress(accounts[0])
        }
        updateReceiverAddress()
    },[accounts, setReceiverAddress])

    useEffect(() => {
        const updateNewTokenMetadata = () => {
            if (currentTokenmetadata) {
                const endorseTokenMetadata = { ...currentTokenmetadata}
                endorseTokenMetadata.attributes = []
                   
                const contributorAttribute:MetadataAttribute = {trait_type:originalTokenId, value:originalToken.tokenId}

                endorseTokenMetadata.name = endorsementTokenName
                endorseTokenMetadata.description = endorsementText 

                endorseTokenMetadata.attributes.push(contributorAttribute)

                const endorseTokenMetadataJson = JSON.stringify(endorseTokenMetadata, null, '\t')
                setNewMetadata(endorseTokenMetadataJson)

                setIsMetadataValid( endorsementText.length<=MAX_ENDORSMENT_LENGTH && endorsementText.length>=MIN_ENDORSEMENT_LENGTH ) 
            }
        }
    
        updateNewTokenMetadata()
    },[currentTokenmetadata, originalToken.tokenId, endorsementText.length, setIsMetadataValid, setNewMetadata, endorsementText])

    const onEndorseClicked = async () => {
        await mintAndUploadMetadata()
    }

    return (
        <Modal open={(!(mintAndMetadaUploadCompleted && mintErrorMessage === ''  && metadataUploadErrorMessage === '')  )&& open} 
            closeIcon
            size="tiny"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}>
            <Modal.Content>
                <Header as='h1'>Endorse community award</Header>
                <p>Endorsement text (max 200 characters)</p>
                
                <Form>                         
                    <TextArea 
                        value={endorsementText} 
                        onChange={(e, { value }) => {setEndorsementText( value?.toString() || '' ); setEndorsementTextEverChanged(true)} }/>             
                </Form>
                
                <div style={{ display: 'flex',justifyContent: 'center'}}>
                    <Button style={{margin: '1em'}} primary 
                        disabled={!canEndorse || !isMetadataValid} 
                        onClick={onEndorseClicked}
                        loading={ mintInProgress || metadataSignAndUploadInProgress }>Endorse and mint</Button>
                </div>
                
                { mintErrorMessage ? 
                    <Message error header='Error while minting' content={mintErrorMessage}/>: <></>}
                { metadataUploadErrorMessage ? 
                    <Message error header='Error while signing and uploading metadata' content={metadataUploadErrorMessage}/>: <></>}


                {metadaSignOrUploadFailed ?
                    <div>
                        <p>Metadata signing and uploading failed. Please try again to avoid having a minted token without metadata.</p>
                        <div style={{ display: 'flex',justifyContent: 'center'}}>
                            <Button color='orange' onClick={() => retrySignAndUploadMetadata()} disabled={metadataSignAndUploadInProgress || !isMetadataValid} loading={metadataSignAndUploadInProgress}>Retry metadata sign and upload</Button>
                        </div>
                    </div>:<></>}
              
            </Modal.Content>
        </Modal>
    )
}


export default EndorseTokenModal