import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Message, Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID } from "../../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import TokenAttributesView from "../TokenAttributesView";
import { useLikeContract, useMetadata, useShareContract } from "../../hooks/hooks";
import { hooks, metaMask as metamaskConnector } from '../../connectors/metaMaskConnector'
import { addressesEqual } from "../../utils";


const { useAccounts, useError, useIsActive } = hooks


const TokenDetailPage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'
    const subgraphTokenId = contractAddress  + '-' + tokenId

    const accounts = useAccounts()
    const active = useIsActive()

    const likeContract = useLikeContract('0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf')
    const shareContract = useShareContract('0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF')

    const [ shareOrLikeInProgress, setShareOrLikeInProgress ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    const metamaskError = useError()

    const tokenQuery = useQuery<ShareableTokenByIdQuery,ShareableTokenByIdQueryVariables>(GET_TOKEN_BY_ID, {client: theGraphApolloClient, pollInterval: 5000, variables: {id: subgraphTokenId}});
    const token = tokenQuery.data?.shareableToken

    console.log('token details', token)

    const [ metadata, consentMissing, metadataErrorMessage ] = useMetadata(contractAddress, tokenId)

    const onLikeClicked = async () => {
        if (likeContract) {

            setShareOrLikeInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await likeContract.mint(tokenId)
                await resultTransaction.wait()
                //TODO remove this await sleep(2000)//cannot refetch the graph data immediately because they are not updated yet
                //await allgraphShareTokensResult.refetch()
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setShareOrLikeInProgress(false)
        }
    }

    const onShareClicked = async () => {
        //TODO not implemented
    }

    const renderMetadataAttributes = () => {
        return <div>{metadata?.attributes ? <TokenAttributesView attributes={metadata.attributes}/> : <></>}</div>
    }

    const renderShareOrLikeButton = () => {
        const isCurrentAccountTokenOwner = (active && accounts) ? addressesEqual(accounts[0], token?.ownerAddress) : false 

        if (isCurrentAccountTokenOwner)
            return <Button primary 
                disabled={!active || !shareContract} 
                onClick={onShareClicked} 
                loading={shareOrLikeInProgress}>Share award</Button>
        else
            return <Button primary 
                disabled={!active || !likeContract} 
                onClick={onLikeClicked} 
                loading={shareOrLikeInProgress}>Like</Button>
    }

    const renderActionButtonArea = () => {
    
        return (
            <div>
                {token?.isLikeToken ? <></> : renderShareOrLikeButton() }
            </div>
        )
    }

    if (tokenQuery.loading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            token? 
                <div>
                    { errorMessage ? 
                        <Message error header='Transaction error' content={errorMessage}/>: <></>}
                    { metamaskError ? 
                        <Message error header='Metamask error' content={metamaskError}/>: <></>}

                    <p> Token id is {tokenId}</p>
                    <div>
                        shared by {token.sharedChildTokens.map((sharedChildToken,i) => 
                            <div key={`${sharedChildToken.id}-${i}`}>{sharedChildToken.ownerAddress}</div>)}
                    </div>

                    { renderActionButtonArea() }

                    {consentMissing ? <div>Consent for this metadata is missing. If you hold this token, connect your wallet to give consent and publish this metadata.</div> 
                        : renderMetadataAttributes()}

                    {metadataErrorMessage ? <Message error header='Error when loading metadata' content={metadataErrorMessage}/> : <></>}
                                        
                </div>
                :
                <div>
                    Token with id {tokenId} not found.
                </div>
        )
}

export default TokenDetailPage