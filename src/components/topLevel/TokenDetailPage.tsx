import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Grid, Header, Message, Popup, Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_LIKE_TOKEN_EXISTS } from "../../queries-thegraph/queries";
import TokenAttributesView from "../TokenAttributesView";
import { useIsCurrentAccountTokenOwner, useLikeContract, useMetadata, useShareContract, useTokenDetails } from "../../hooks/hooks";
import { hooks } from '../../connectors/metaMaskConnector'
import { buildSubgraphTokenEntityId, likeContractAddress, shareContractAddress } from "../../utils";
import { BigNumber } from "@ethersproject/bignumber";
import { LikeTokenExistsQuery, LikeTokenExistsQueryVariables } from "../../queries-thegraph/types-thegraph/LikeTokenExistsQuery";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { buildTokenShareRoute } from "../../routingUtils";
import { ShareableTokenByIdQuery_shareableToken } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import { TokenCard } from "../TokenGrid";
import { authorPropertyName, subContributionPropertyName, subContributorPropertyName } from "../../types/NFTMetadata";

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

    //TODO refactor this - copied from TokenGrid
    const tokenName = metadata?.name
    const tokenSubcontributionName = metadata?.attributes.find((attribute) => attribute.trait_type === subContributionPropertyName)?.value 
    const tokenDisplayName = tokenSubcontributionName ? tokenSubcontributionName : tokenName

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

    const renderMetadataAttributes = (token:ShareableTokenByIdQuery_shareableToken) => {
        return <div>{metadata?.attributes ? <TokenAttributesView token={token} attributes={metadata.attributes}/> : <>metadata not available</>}</div>
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
                    disabled={!active || !likeContract || likeTokenExists || likeInProgress} 
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

    const renderTokenDetailsPage = (token:ShareableTokenByIdQuery_shareableToken) => {
        return <div style={{'margin': '0 10vw'}}>
            <Grid columns={2} style={{'margin': '3vh 0'}}>
                <Grid.Column style={{'text-align': 'left'}} >
                    <Header.Subheader className="Award-subheader">Award details</Header.Subheader>
                    <Header as='h1'>{tokenDisplayName}</Header>
                </Grid.Column> <Grid.Column style={{'justify-content': 'right', 'display': 'flex', 'align-items': 'center'}} >
                    { renderActionButtonArea() }
                </Grid.Column>
            </Grid>
            
            <div style={{'margin': '2vh 0 4vh 0'}}>
                <Card fluid>
                    <Grid columns={2} style={{'margin': '2vh 2vw'}}>
                        {renderLeftColumn(token)}
                        {renderRightColumn(token)}
                    </Grid>
                </Card>
            </div>
        </div>
    }

    const renderLeftColumn = (token:ShareableTokenByIdQuery_shareableToken) => {
        return <Grid.Column style={{'text-align': 'center'}} >
            <TokenCard token={token}/>
        </Grid.Column>
    }

    const renderRightColumn = (token:ShareableTokenByIdQuery_shareableToken) => {
        return <Grid.Column><div>
            { errorMessage ? 
                <Message error header='Transaction error' content={errorMessage}/>: <></>}
            { metamaskError ? 
                <Message error header='Metamask error' content={metamaskError}/>: <></>}

            {consentMissing ? <div>Consent for this metadata is missing. If you hold this token, connect your wallet to give consent and publish this metadata.</div> 
                : renderMetadataAttributes(token)}

            {metadataErrorMessage ? <Message error header='Error when loading metadata' content={metadataErrorMessage}/> : <></>}
                        
        </div></Grid.Column>
    }

    if (detailedTokenLoading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            detailedToken? renderTokenDetailsPage(detailedToken)
                :
                <div>
                    Token with id {tokenId} not found in contract {contractAddress}.
                </div>
        )
}

export default TokenDetailPage