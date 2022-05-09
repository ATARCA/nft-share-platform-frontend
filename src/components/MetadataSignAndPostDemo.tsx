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

    const provider = useProvider()
    const active = useIsActive()

    const [ getMetadataToSign, metadataToSign]  = useLazyQuery<GetMessageToSignForMetadataUploadQuery, 
                                                                GetMessageToSignForMetadataUploadQueryVariables>
                                                                (GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD,
                                                                    {client: backendApolloClient})

    const onSignAndUploadClicked = async () => {
        console.log('on sign clicked')
        await getMetadataToSign({variables: {txHash: txHash, metadata: metadata}})
        const messageToSign = metadataToSign.data?.getMetadataUploadMessageToSign
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
                    <TextArea  onChange={(e, { value }) => setMetadata( (value?.toString() || '') )}/>
                </Form.Field>
            </Form>

            <MetadataEntryForm/>

            <Button disabled={!active} onClick={onSignAndUploadClicked}>Sign and upload metadata</Button>
        </div>
    )
}