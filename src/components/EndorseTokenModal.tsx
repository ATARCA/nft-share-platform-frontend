import React, {useEffect, useState} from "react";
import {Button, Modal, Checkbox, Item, Input, Message} from "semantic-ui-react";
import { hooks } from "../connectors/metaMaskConnector";
import useCookie from 'react-use-cookie';
import { useCanCurrentAccountEndorse, useCurrentProjectId, useEndorseContract, useMetadata, useMintTokenAndUploadMetadata } from "../hooks/hooks";
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { MetadataAttribute, originalTokenId } from "../types/NFTMetadata";

const { useProvider, useAccounts, useIsActive, useAccount } = hooks

const MAX_ENDORSMENT_LENGTH = 200
const MIN_ENDORSEMENT_LENGTH = 5

const EndorseTokenModal = ( {originalToken} : {originalToken: TokenByIdQuery_token }) => {
    const [endorsementText, setEndorsementText] = useState('')
    const [endorsementTextEverChanged, setEndorsementTextEverChanged] = useState(false)
    const [ open, setOpen ] = useState(true)

    const [ endorseInProgress, setEndorseInProgress ] = useState(false)
    const accounts = useAccounts()


    const projectId = useCurrentProjectId() || 'N/A'
    const [ tokenDisplayName, tokenHolderDisplayName, currentTokenmetadata, consentMissing, metadataErrorMessage ] = useMetadata(originalToken)
    const endorseContract = useEndorseContract(projectId)
    const canEndorse = useCanCurrentAccountEndorse(originalToken)
    //next extend existing metadata with endorsement the same way it is done on share page - or use completely new metadata? Check figma
    const [ errorMessage, setErrorMessage ] = useState('')

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
                   
                endorseTokenMetadata.description = 'Endorsement'
                endorseTokenMetadata.name = endorsementText

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
        <Modal open={!mintAndMetadaUploadCompleted && open} 
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}>
            <Modal.Content>
                <Input fluid 
                    value={endorsementText} 
                    error={!isMetadataValid && endorsementTextEverChanged}
                    onChange={(e, { value }) => {setEndorsementText( value ); setEndorsementTextEverChanged(true)} }/>             

                <Button primary 
                    disabled={!canEndorse || endorseInProgress || !isMetadataValid} 
                    onClick={onEndorseClicked} 
                    loading={endorseInProgress}>Endorse</Button>

                { errorMessage ? 
                    <Message error header='Transaction error' content={errorMessage}/>: <></>}
              
            </Modal.Content>
        </Modal>
    )
}


export default EndorseTokenModal