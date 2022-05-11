import React, { useState } from "react";
import { hooks } from '../connectors/metaMaskConnector'

import { Input, Form, TextArea, Button } from "semantic-ui-react";
import { useLazyQuery } from '@apollo/client'
import { GetMessageToSignForMetadataUploadQueryVariables, GetMessageToSignForMetadataUploadQuery } from "../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD } from "../queries-backend/queries";
import { backendApolloClient } from "../graphql/backendApolloClient";
import { MetadataEntryForm } from "./MetadataEntryForm";

const { useIsActive, useProvider } = hooks

export const MetadataSignAndPostDemo = () => {

    const [ txHash, setTxHash ] = useState('')
    const [ metadata, setMetadata ] = useState('')

    const [ isMetadataValid, setIsMetadataValid ] = useState(false)

    const provider = useProvider()
    const active = useIsActive()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ getMetadataToSign, _metadataToSign]  = useLazyQuery<GetMessageToSignForMetadataUploadQuery, 
                                                                GetMessageToSignForMetadataUploadQueryVariables>
                                                                (GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD,
                                                                    {client: backendApolloClient})

    const onSignAndUploadClicked = async () => {
        //TODO token minting call is missing - do not wait for mint to be done before publishing metadata
        console.log('on sign clicked',{variables: {txHash: txHash, metadata: metadata}})
        const result = await getMetadataToSign({variables: {txHash: txHash, metadata: metadata}})
        const messageToSign = result.data?.getMetadataUploadMessageToSign
        console.log('now sign...', messageToSign)

        if (messageToSign) {
            const signedMessage = await provider?.getSigner().signMessage(messageToSign)
            console.log('signed message', signedMessage)
        }
        else console.error('Message to sign cannot be undefined')
    }

    return (
        <div style={{margin: '0px 20vw 0px 20vw'}}>
            Metadata test
            <Form>
                <Form.Field>
                    <Input label='txHash' onChange={(e, { value }) => setTxHash( value )}/>
                </Form.Field>
                <label>metadata</label>
                <Form.Field>
                    <TextArea value={metadata} />
                </Form.Field>
            </Form>

            <MetadataEntryForm 
                onIsValid={(isValid) => setIsMetadataValid(isValid)}
                onMetadataChanged={(metadataNew) => setMetadata(metadataNew)}/>

            <Button disabled={!active || !isMetadataValid} onClick={onSignAndUploadClicked}>Sign and upload metadata</Button>
        </div>
    )
}