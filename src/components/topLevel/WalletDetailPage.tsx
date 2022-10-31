import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { GET_TOKENS_OF_ADDRESS } from '../../queries-thegraph/queries';
import { useParams } from 'react-router-dom';
import { Message, Label, Header } from 'semantic-ui-react';
import { useQuery } from '@apollo/client'
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { TokensOfAddressQuery, TokensOfAddressQueryVariables } from '../../queries-thegraph/types-thegraph/TokensOfAddressQuery';
import TokenGrid from '../TokenGrid';

export const WalletDetailPage = () => {
    const walletAddress = useParams().walletAddress || 'undefined'
    const isValidAddress = ethers.utils.isAddress(walletAddress)
    const [isReceivedAwardsSelected, setIsReceivedAwardsSelected] = useState(true)

    const originalTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: true, isSharedInstance: false, isLikeToken: false}});

    const sharedTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: false, isSharedInstance: true, isLikeToken: false}});

    const likeTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: false, isSharedInstance: false, isLikeToken: true}});

    const originalTokensLength = originalTokensResult?.data?.tokens.length || 0
    const sharedTokensLength = sharedTokensResult?.data?.tokens.length || 0
    const likeTokensLength = likeTokensResult?.data?.tokens.length || 0
        
    useEffect(() => {
        const jumpToSupportedTabIfUserHasNoReceivedTokens = () => {
            if (originalTokensLength === 0 &&
                sharedTokensLength === 0 &&
                likeTokensLength !== 0 ) {
                setIsReceivedAwardsSelected(false)
            }
        }
        jumpToSupportedTabIfUserHasNoReceivedTokens()
    }, [originalTokensLength, sharedTokensLength, likeTokensLength])

    if (!isValidAddress) {
        return <div>
            <Message error>&quot;{walletAddress}&quot; is not a valid address</Message>
        </div>
    }

    const getLabelClassName = (isSelected: boolean) => {
        if (isSelected) return 'Category-switch-active'
        else return 'Category-switch-inactive'
    }

    const getTokensForCurrentTab = () => {
        if (isReceivedAwardsSelected) {
            const originalTokens = originalTokensResult.data?.tokens || []
            const sharedTokens = sharedTokensResult.data?.tokens || []
            return originalTokens.concat(sharedTokens)
        }
        else {
            return likeTokensResult.data?.tokens || []
        }
    }

    return <div>
        <div style={{'textAlign': 'left', padding: '5vh 10vw 1vh 10vw'}}>
            <Header.Subheader className="Page-subheader">Wallet</Header.Subheader>
            <Header className="No-overflow" as='h1'>{walletAddress}</Header>
            <Label.Group circular style={{padding: '3vh 0'}}>
                <Label as='a' className={getLabelClassName(isReceivedAwardsSelected)} onClick={() => setIsReceivedAwardsSelected(true)}>Received awards</Label>
                <Label as='a' className={getLabelClassName(!isReceivedAwardsSelected)} onClick={() => setIsReceivedAwardsSelected(false)}>Liked awards</Label>
            </Label.Group>
        </div>
        <TokenGrid tokens={getTokensForCurrentTab()} showCardWhenDataMissing={true} isLoading={originalTokensResult.loading || sharedTokensResult.loading || likeTokensResult.loading}/>
    </div>
}



