import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Grid, Header, Icon, Message, Popup, Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_LIKE_TOKEN_EXISTS } from "../../queries-thegraph/queries";
import TokenAttributesView from "../TokenAttributesView";
import { useCanCurrentAccountEndorse, useCurrentProjectId, useIsCurrentAccountTokenOwner, useLikeContract, useMetadata, useShareContract, useTokenDetails } from "../../hooks/hooks";
import { hooks } from '../../connectors/metaMaskConnector'
import { BigNumber } from "@ethersproject/bignumber";
import { LikeTokenExistsQuery, LikeTokenExistsQueryVariables } from "../../queries-thegraph/types-thegraph/LikeTokenExistsQuery";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { buildTokenShareRoute } from "../../routingUtils";
import { TokenByIdQuery_token } from "../../queries-thegraph/types-thegraph/TokenByIdQuery";
import { TokenCard } from "../TokenGrid";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon } from "react-share";
import { useLocation } from "react-router-dom";
import EndorseOrLikeChooserModal from "../EndorseOrLikeChooserModal";
import { EndorsementCarousel } from "../EndorsementCarousel";

const { useAccounts, useError, useIsActive } = hooks

const TokenDetailPage = () => { 
    const location = useLocation();

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'

    const accounts = useAccounts()
    const active = useIsActive()
    const navigate = useNavigate()

    const projectId = useCurrentProjectId() || 'N/A'

    const likeContract = useLikeContract(projectId)
    const shareContract = useShareContract(projectId)

    const [ showEndorseChooser, setShowEndorseChooser ] = useState(false)

    const [ likeInProgress, setLikeInProgress ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    const metamaskError = useError()
    
    const [ detailedToken, detailedTokenLoading ] = useTokenDetails(contractAddress, BigNumber.from(tokenId))
    const isCurrentAccountTokenOwner = useIsCurrentAccountTokenOwner(detailedToken?.ownerAddress)
    const canEndorse = useCanCurrentAccountEndorse(detailedToken)

    const isLikeToken = detailedToken?.isLikeToken
    const isEndorseToken = detailedToken?.isEndorseToken
    const originalTokenEntityId =  isLikeToken ? detailedToken?.likedParentToken?.id : detailedToken?.id

    //TODO extract this to custom hook after switching to subgraph web sockets 
    const [ getLikeTokenExists, likeTokenExistsResult] = useLazyQuery<LikeTokenExistsQuery,LikeTokenExistsQueryVariables>(GET_LIKE_TOKEN_EXISTS, {
        client: theGraphApolloClient, 
        pollInterval: 5000,
        onError: defaultErrorHandler,
    });

    useEffect(() => {
        if (originalTokenEntityId) {
            getLikeTokenExists({variables: { likeTokenOwnerAddress: accounts ? accounts[0] : "" ,parentTokenEntityId: originalTokenEntityId }})
        }
    },[accounts, originalTokenEntityId, getLikeTokenExists, likeInProgress])

    const likeTokenExists = likeTokenExistsResult.data?.tokens.length !== 0

    const [ tokenDisplayName, tokenHolderDisplayName, metadata, consentMissing, metadataErrorMessage ] = useMetadata(detailedToken)

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

    const renderMetadataAttributes = (token:TokenByIdQuery_token) => {
        return <div>{metadata?.attributes ? <TokenAttributesView token={token} metadata={metadata}/> : <p>Metadata not available. URI <a target={"_blank"} href={token.metadataUri||''} rel="noreferrer">{token.metadataUri}</a></p>}</div>
    }

    const getShareButtonExplainerText = () => {
        if (active) return 'On-chain transaction needed. Share this token with another person that helped you achieve this award.'
        else return 'Connect your wallet to share this token.'
    }

    const getLikeButtonExplainerText = () => {
        if (active) return 'On-chain transaction needed. You will share an instance of this token to your wallet.'
        else return 'Connect your wallet to like this token.'
    }

    const likeBtnDisabled = !active || !likeContract || likeTokenExists || likeInProgress;

    const renderShareOrLikeOrEndorseButton = () => {

        if (isCurrentAccountTokenOwner)
            return <>
                <Button primary 
                    disabled={!active || !shareContract} 
                    onClick={onShareClicked} 
                    loading={likeInProgress}>Share award</Button>
                <Popup content={getShareButtonExplainerText()} position='bottom left' trigger={<Icon color="grey" style={{margin : '0.5em'}}
                    className="Icon-explainer" name="question circle"/>}/>
            </>
        else
            return <>
                {canEndorse ? <></> : <> <Popup
                    content='You have already liked this token'
                    disabled={!likeTokenExists}
                    trigger={<span><Button primary 
                        disabled={likeBtnDisabled} 
                        onClick={onLikeClicked} 
                        loading={likeInProgress}>Like</Button></span>}                    
                />

                <Popup content={getLikeButtonExplainerText()} position='bottom left' trigger={<Icon color="grey" style={{margin : '0.5em'}}
                    name="question circle"/>}/>
                </>}

                {canEndorse ? <Button primary loading={likeInProgress}
                    onClick={ () => setShowEndorseChooser(true)}>Support award</Button> : <></>}

                { detailedToken ? <EndorseOrLikeChooserModal open={showEndorseChooser} setOpen={setShowEndorseChooser} onLikeClicked={onLikeClicked} likeBtnDisabled={likeBtnDisabled} originalToken={detailedToken}/> : <></>}
            </>
    }

    const renderActionButtonArea = () => {
        return (
            <div>
                { isLikeToken || isEndorseToken ? <></> : renderShareOrLikeOrEndorseButton() }
            </div>
        )
    }

    const renderTokenDetailsPage = (token:TokenByIdQuery_token) => {
        return <div style={{'margin': '0 10vw'}}>
            <Grid columns={2} style={{'margin': '3vh 0'}}>
                <Grid.Column style={{'textAlign': 'left'}} >
                    <Header.Subheader className="Page-subheader">Award details</Header.Subheader>
                    <Header className="No-overflow" as='h1'>{tokenDisplayName}</Header>
                </Grid.Column> 
                <Grid.Column style={{'justifyContent': 'right', 'display': 'flex', 'alignItems': 'center'}} >
                    { renderActionButtonArea() }
                </Grid.Column>
            </Grid>
            
            <div style={{'margin': '2vh 0 4vh 0'}}>
                <Card fluid>
                    <Grid columns={2} stackable={true} style={{'margin': '2vh 2vw'}}>
                        {renderLeftColumn(token)}
                        {renderRightColumn(token)}
                    </Grid>
                </Card>
                {detailedToken ? <EndorsementCarousel parentToken={detailedToken}/> : <></>}
            </div>
        </div>
    }

    const renderLeftColumn = (token:TokenByIdQuery_token) => {
        return <Grid.Column style={{'textAlign': 'center'}} >
            <TokenCard token={token} showCardWhenDataMissing={true}/>
            <Grid columns='equal' style={{'marginTop':'0px', 'marginLeft':'0px', 'marginRight':'0px'}}>
                <Grid.Column key={"facebook"}>
                    <FacebookShareButton quote="Check out this cool award" url={'https://talkoapp.io'+location.pathname}><FacebookIcon size={40} round /></FacebookShareButton>
                </Grid.Column>
                <Grid.Column key={"twitter"}>
                    <TwitterShareButton url={'https://talkoapp.io'+location.pathname}><TwitterIcon size={40} round /></TwitterShareButton>
                </Grid.Column>
                <Grid.Column key={"linkedin"}>
                    <LinkedinShareButton url={'https://talkoapp.io'+location.pathname}><LinkedinIcon size={40} round/></LinkedinShareButton>
                </Grid.Column>
            </Grid>
        </Grid.Column>
    }

    const renderRightColumn = (token:TokenByIdQuery_token) => {
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