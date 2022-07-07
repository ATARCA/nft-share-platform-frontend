import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Message, Popup, Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID, GET_LIKE_TOKEN_EXISTS } from "../../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import TokenAttributesView from "../TokenAttributesView";
import { useIsCurrentAccountTokenOwner, useLikeContract, useMetadata, useShareContract, useTokenDetails } from "../../hooks/hooks";
import { hooks, metaMask as metamaskConnector } from '../../connectors/metaMaskConnector'
import { addressesEqual, buildSubgraphTokenEntityId, likeContractAddress, shareContractAddress } from "../../utils";
import { BigNumber } from "@ethersproject/bignumber";
import { LikeTokenExistsQuery, LikeTokenExistsQueryVariables } from "../../queries-thegraph/types-thegraph/LikeTokenExistsQuery";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { buildTokenShareRoute } from "../../routingUtils";

const { useAccounts, useError, useIsActive } = hooks

const TokenDetailPage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'

    const accounts = useAccounts()
    const active = useIsActive()
    const navigate = useNavigate()

    const likeContract = useLikeContract(likeContractAddress)
    const shareContract = useShareContract(shareContractAddress)

    const [ likeInProgress, setLikeInProgress ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    const metamaskError = useError()

    const [ detailedToken, detailedTokenLoading ] = useTokenDetails(contractAddress, BigNumber.from(tokenId))
    const isCurrentAccountTokenOwner = useIsCurrentAccountTokenOwner(detailedToken?.ownerAddress)

    const likeTokenExistsQuery = useQuery<LikeTokenExistsQuery,LikeTokenExistsQueryVariables>(GET_LIKE_TOKEN_EXISTS, {
        client: theGraphApolloClient, 
        pollInterval: 5000, 
        onError: defaultErrorHandler,
        variables: { likeTokenOwnerAddress: accounts ? accounts[0] : "" ,parentTokenEntityId: buildSubgraphTokenEntityId(shareContractAddress, BigNumber.from(tokenId))}});

    const likeTokenExists = likeTokenExistsQuery.data?.shareableTokens.length !== 0


    const [ metadata, consentMissing, metadataErrorMessage ] = useMetadata(contractAddress, tokenId)

    const onLikeClicked = async () => {
        if (likeContract) {

            setLikeInProgress(true)
            setErrorMessage('')
            try {
                const resultTransaction = await likeContract.mint(tokenId)
                await resultTransaction.wait()
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setLikeInProgress(false)
        }
    }

    const onShareClicked = async () => {
        navigate(buildTokenShareRoute(contractAddress,BigNumber.from(tokenId)))
    }

    const renderMetadataAttributes = () => {
        return <div>{metadata?.attributes ? <TokenAttributesView attributes={metadata.attributes}/> : <></>}</div>
    }

    const renderShareOrLikeButton = () => {

        if (isCurrentAccountTokenOwner)
            return <Button primary 
                disabled={!active || !shareContract} 
                onClick={onShareClicked} 
                loading={likeInProgress}>Share award</Button>
        else
            return <Popup 
                content='You have already liked this token'
                disabled={!likeTokenExists}
                trigger={<span><Button primary 
                    disabled={!active || !likeContract || likeTokenExists} 
                    onClick={onLikeClicked} 
                    loading={likeInProgress}>Like</Button></span>
                }
            />
    }

    const renderActionButtonArea = () => {
    
        return (
            <div>
                {detailedToken?.isLikeToken ? <></> : renderShareOrLikeButton() }
            </div>
        )
    }

    if (detailedTokenLoading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            detailedToken? 
                <div>
                    { errorMessage ? 
                        <Message error header='Transaction error' content={errorMessage}/>: <></>}
                    { metamaskError ? 
                        <Message error header='Metamask error' content={metamaskError}/>: <></>}

                    <p> Token id is {tokenId}</p>
                    <div>
                        shared by {detailedToken.sharedChildTokens.map((sharedChildToken,i) => 
                            <div key={`${sharedChildToken.id}-${i}`}>{sharedChildToken.ownerAddress}</div>)}
                    </div>

                    { renderActionButtonArea() }

                    {consentMissing ? <div>Consent for this metadata is missing. If you hold this token, connect your wallet to give consent and publish this metadata.</div> 
                        : renderMetadataAttributes()}

                    {metadataErrorMessage ? <Message error header='Error when loading metadata' content={metadataErrorMessage}/> : <></>}
                                        
                </div>
                :
                <div>
                    Token with id {tokenId} not found in contract {contractAddress}.
                </div>
        )
}

export default TokenDetailPage