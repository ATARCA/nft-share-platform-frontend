import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { Button, Menu, Message } from 'semantic-ui-react';
import { hooks } from '../connectors/metaMaskConnector';
import { backendApolloClient } from '../graphql/backendApolloClient';
import { useConsentNeeded } from '../hooks/hooks';
import { ADD_SIGNED_CONSENT, GET_CONSENT_MESSAGE_TO_SIGN } from '../queries-backend/queries';
import { AddSignedConsentMutation, AddSignedConsentMutationVariables } from '../queries-backend/types-backend/AddSignedConsentMutation';
import { GetConsentMessageToSignQuery } from '../queries-backend/types-backend/GetConsentMessageToSignQuery';
import { ConsentContent } from './ConsentContent';

const { useProvider, useAccount } = hooks

export const ConsentPanel = () => {
  
    const getConsentMessageResult = useQuery<GetConsentMessageToSignQuery,undefined>(GET_CONSENT_MESSAGE_TO_SIGN, {client: backendApolloClient});
    
    const provider = useProvider()
    const signingAddress = useAccount() || 'address undefined'

    const [uploadConsentFunction, uploadConsentResult] = useMutation<AddSignedConsentMutation, AddSignedConsentMutationVariables>(ADD_SIGNED_CONSENT,  {client: backendApolloClient})
    const [consentNeeded, refetchConsent] = useConsentNeeded()
    const messageToSign = getConsentMessageResult.data?.getConsentMessageToSign

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
            await refetchConsent()
        }
    }
      
    return consentNeeded ? 
        <div  className='top-level-page'>
            <ConsentContent/>
            <Button primary onClick={onGiveConsentClicked}>Sign consent</Button>
            { uploadConsentResultError ? <Message error>
                <Message.Header>Consent upload failed</Message.Header>
                <p>{uploadConsentResultError}</p>
            </Message> : <></>}
        </div>
        : <></>;
};

export default ConsentPanel;


