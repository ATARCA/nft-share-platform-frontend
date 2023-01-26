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

    enum SelectedTab { ReceivedAwards, LikedTokens, EndorseTokens }

    const walletAddress = useParams().walletAddress || 'undefined'
    const isValidAddress = ethers.utils.isAddress(walletAddress)
    const [selectedTab, setSelectedTab] = useState(SelectedTab.ReceivedAwards)

    const originalTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: true, isSharedInstance: false, isLikeToken: false, isEndorseToken:false}});

    const sharedTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: false, isSharedInstance: true, isLikeToken: false, isEndorseToken:false}});

    const likeTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: false, isSharedInstance: false, isLikeToken: true, isEndorseToken:false}});

    const endorseTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: walletAddress, isOriginal: false, isSharedInstance: false, isLikeToken: false, isEndorseToken:true}});

    const originalTokensLength = originalTokensResult?.data?.tokens.length || 0
    const sharedTokensLength = sharedTokensResult?.data?.tokens.length || 0
    const likeTokensLength = likeTokensResult?.data?.tokens.length || 0
        
    useEffect(() => {
        const jumpToSupportedTabIfUserHasNoReceivedTokens = () => {
            if (originalTokensLength === 0 &&
                sharedTokensLength === 0 &&
                likeTokensLength !== 0 ) {
                setSelectedTab(SelectedTab.LikedTokens)
            }
        }
        jumpToSupportedTabIfUserHasNoReceivedTokens()
    }, [originalTokensLength, sharedTokensLength, likeTokensLength, SelectedTab.LikedTokens])

    if (!isValidAddress) {
        return <div>
            <Message error>&quot;{walletAddress}&quot; is not a valid address</Message>
        </div>
    }

    const getLabelClassName = (tab: SelectedTab) => {
        if (selectedTab === tab) return 'Category-switch-active'
        else return 'Category-switch-inactive'
    }

    const getTokensForCurrentTab = () => {
        if (selectedTab === SelectedTab.ReceivedAwards) {
            const originalTokens = originalTokensResult.data?.tokens || []
            const sharedTokens = sharedTokensResult.data?.tokens || []
            return originalTokens.concat(sharedTokens)
        }
        else if (selectedTab === SelectedTab.LikedTokens){
            return likeTokensResult.data?.tokens || []
        }
        else {
            return endorseTokensResult.data?.tokens || []
        }
    }

    return <div>
        <div style={{'textAlign': 'left', padding: '5vh 10vw 1vh 10vw'}}>
            <Header.Subheader className="Page-subheader">Wallet</Header.Subheader>
            <Header className="No-overflow" as='h1'>{walletAddress}</Header>
            <Label.Group circular style={{padding: '3vh 0'}}>
                <Label as='a' className={getLabelClassName(SelectedTab.ReceivedAwards)} onClick={() => setSelectedTab(SelectedTab.ReceivedAwards)}>Received awards</Label>
                <Label as='a' className={getLabelClassName(SelectedTab.LikedTokens)} onClick={() => setSelectedTab(SelectedTab.LikedTokens)}>Liked awards</Label>
                <Label as='a' className={getLabelClassName(SelectedTab.EndorseTokens)} onClick={() => setSelectedTab(SelectedTab.EndorseTokens)}>Given endorsements</Label>
            </Label.Group>
        </div>
        <TokenGrid tokens={getTokensForCurrentTab()} showCardWhenDataMissing={true} isLoading={originalTokensResult.loading || sharedTokensResult.loading || likeTokensResult.loading}/>
    </div>
}



