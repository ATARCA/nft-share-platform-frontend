import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { Button, Menu, Message } from 'semantic-ui-react';
import { hooks } from '../connectors/metaMaskConnector';
import { backendApolloClient } from '../graphql/backendApolloClient';
import { ADD_SIGNED_CONSENT, CONSENT_NEEDED, GET_CONSENT_MESSAGE_TO_SIGN } from '../queries-backend/queries';
import { AddSignedConsentMutation, AddSignedConsentMutationVariables } from '../queries-backend/types-backend/AddSignedConsentMutation';
import { ConsentNeededQuery, ConsentNeededQueryVariables } from '../queries-backend/types-backend/ConsentNeededQuery';
import { GetConsentMessageToSignQuery } from '../queries-backend/types-backend/GetConsentMessageToSignQuery';

const { useIsActive, useProvider, useAccount } = hooks

export const ConsentPanel = () => {

    const active = useIsActive()
    return active ? <ConsentPanelContent/> : <></>;
}

const ConsentPanelContent = () => {
  
    const getConsentMessageResult = useQuery<GetConsentMessageToSignQuery,undefined>(GET_CONSENT_MESSAGE_TO_SIGN, {client: backendApolloClient});
    
    const provider = useProvider()
    const signingAddress = useAccount() || 'address undefined'

    const [uploadConsentFunction, uploadConsentResult] = useMutation<AddSignedConsentMutation, AddSignedConsentMutationVariables>(ADD_SIGNED_CONSENT,  {client: backendApolloClient})
    const consentNeededResult = useQuery<ConsentNeededQuery, ConsentNeededQueryVariables>(CONSENT_NEEDED, {client: backendApolloClient, variables: {address:signingAddress} });
    
    const messageToSign = getConsentMessageResult.data?.getConsentMessageToSign
    const consentNeeded = consentNeededResult.data?.consentNeeded

    const uploadConsentResultError = uploadConsentResult.data?.addSignedConsent.message

    const onGiveConsentClicked = async () => {
        if (messageToSign) {
            const signedConsentMessage = await provider?.getSigner().signMessage(messageToSign)            
            if (signedConsentMessage) {
                await uploadConsent(signedConsentMessage)
            }
        } else {
            console.error('consent message loading failed',getConsentMessageResult.error)
        }
    }
    
    const uploadConsent = async (signedConsentMessage: string) => {
        if (messageToSign && signingAddress) {
            await uploadConsentFunction({variables: {signingAddress, signature:signedConsentMessage, consentText: messageToSign}})
            await consentNeededResult.refetch()
        }
    }
      
    return consentNeeded ? 
        <Menu fluid vertical>
            <Menu.Item>
                <p>You need to give consent before using the platform. TODO complete text.</p>
                <Button primary onClick={onGiveConsentClicked}>Sign consent</Button>
                { uploadConsentResultError ? <Message error>
                    <Message.Header>Consent upload failed</Message.Header>
                    <p>{uploadConsentResultError}</p>
                </Message> : <></>}
            </Menu.Item>
        </Menu> 
        : <></>;
};

export default ConsentPanel;


