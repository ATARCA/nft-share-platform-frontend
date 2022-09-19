import { useMutation } from "@apollo/client/react/hooks/useMutation";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import React from "react";
import { Button, Container, Header, Message } from "semantic-ui-react";
import { hooks } from "../../connectors/metaMaskConnector";
import { backendApolloClient } from "../../graphql/backendApolloClient";
import { useConsentNeeded } from "../../hooks/hooks";
import { GET_REVOKE_CONSENT_MESSAGE_TO_SIGN, REVOKE_SIGNED_CONSENT } from "../../queries-backend/queries";
import { GetRevokeConsentMessageToSignQuery } from "../../queries-backend/types-backend/GetRevokeConsentMessageToSignQuery";
import { RevokeSignedConsentMutation, RevokeSignedConsentMutationVariables } from "../../queries-backend/types-backend/RevokeSignedConsentMutation";
import { ConsentContent } from "../ConsentContent";
import OnboardingCarousel from "../onboarding/OnboardingCarousel";

const { useIsActive, useProvider, useAccount } = hooks

export const ManageConsentPage = () => {
    const provider = useProvider()
    const signingAddress = useAccount() || 'address undefined'
    const active = useIsActive()

    const getRevokeConsentMessageResult = useQuery<GetRevokeConsentMessageToSignQuery,undefined>(GET_REVOKE_CONSENT_MESSAGE_TO_SIGN, {client: backendApolloClient});
    const [consentNeeded, refetchConsent] = useConsentNeeded()

    const [uploadRevokedConsentFunction, uploadRevokedConsentResult] = useMutation<RevokeSignedConsentMutation, RevokeSignedConsentMutationVariables>(REVOKE_SIGNED_CONSENT,  {client: backendApolloClient})

    const messageToSign = getRevokeConsentMessageResult.data?.getRevokeConsentMessageToSign


    const onRevokeConsentClicked = async () => {
        if (messageToSign) {
            const signedConsentMessage = await provider?.getSigner().signMessage(messageToSign)            
            if (signedConsentMessage) {
                await uploadRevokeConsent(signedConsentMessage)
            }
        } else {
            console.error('consent message loading failed',getRevokeConsentMessageResult.error)
        }
    }

    const uploadRevokeConsent = async (signedConsentMessage: string) => {
        if (messageToSign && signingAddress) {
            await uploadRevokedConsentFunction({variables: {signingAddress, signature:signedConsentMessage, consentText: messageToSign}})
            await refetchConsent()
        }
    }

    if (!active) return <div className='top-level-page'>
        <Message warning> Connect your wallet to manage your consent.</Message>
    </div>

    if (consentNeeded)
        return <></>
    else
        return <div className='top-level-page'>
            
            <ConsentContent/>
            <Button onClick={onRevokeConsentClicked}>Revoke consent</Button>

        </div>
}