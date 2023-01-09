import { BigNumber } from '@ethersproject/bignumber';
import React, { CSSProperties } from 'react';
import icon_thumbsUp from '../images/icon_ThumbsUp.svg';
import icon_Share from '../images/icon_ShareNetwork.svg';

import { useNavigate } from 'react-router-dom';
import { Card, Grid, Image, Label, Rail, Segment, SemanticWIDTHS } from 'semantic-ui-react';
import { useMetadata } from '../hooks/hooks';
import { TokensQuery_tokens } from '../queries-thegraph/types-thegraph/TokensQuery';
import { buildTokenDetailRoute } from '../routingUtils';
import { categoryPropertyName, NFTMetadata } from '../types/NFTMetadata';
import { TokensOfAddressQuery_tokens } from '../queries-thegraph/types-thegraph/TokensOfAddressQuery';
import { TokenByIdQuery_token } from '../queries-thegraph/types-thegraph/TokenByIdQuery';

const alwaysShowCardEnvFlag = process.env.REACT_APP_ALWAYS_SHOW_TOKEN_CARD === 'true'

export const TokenGrid = ({tokens, isLoading, showCardWhenDataMissing = false, transparentBackground = false, style, lastElement, columns = 3 }: 
    {tokens: TokensQuery_tokens[] | TokensOfAddressQuery_tokens[], 
        isLoading:boolean, 
        showCardWhenDataMissing?: boolean, 
        transparentBackground?: boolean, 
        style?: CSSProperties, 
        lastElement?: React.ReactNode,
        columns?: SemanticWIDTHS}) => {

    const getBackgroundClassName = () => {
        if (transparentBackground) return ''
        else return 'TokenGridBackground'
    }

    if (isLoading) return <div className={getBackgroundClassName()} style={style}>
        <Segment placeholder vertical padded='very' loading/>
    </div>
    
    return (
        <div className={getBackgroundClassName()} style={style}>
            {tokens.length === 0? 
                <p style={{ padding: '10vh 10vw 30vh 10vw'}}>No tokens to show.</p>
                :
                <Grid doubling centered columns={columns} style={{ padding: '5vh 10vw 5vh 10vw', maxWidth:'120em', margin: 'auto'}}>
                    {tokens.map(t => 
                        <TokenCard key={t.id} token={t} showCardWhenDataMissing={showCardWhenDataMissing} renderAsGridColumn={true}/>
                    )}
                    {lastElement ? lastElement : <></>}
                </Grid>
            } 
        </div>
    );
};

export const TokenCard = ({token, centered = true, useDummyMetadata, showCardWhenDataMissing = false, renderAsGridColumn = false}: 
    {token:TokensQuery_tokens | TokensOfAddressQuery_tokens | TokenByIdQuery_token, 
        centered?: boolean, 
        useDummyMetadata? : NFTMetadata,
        showCardWhenDataMissing?: boolean,
        renderAsGridColumn?: boolean}) => {

    const navigate = useNavigate()
    const [tokenDisplayName, tokenHolderDisplayName, metadata, consentMissing, errorMessage] = useMetadata(token, useDummyMetadata)

    const imageURL = metadata?.image ? metadata.image : 'https://react.semantic-ui.com/images/wireframe/paragraph.png'
    
    const tokenCategory = metadata?.attributes?.find((attribute) => attribute.trait_type === categoryPropertyName)?.value 

    let likesCount = 0
    if (token.isLikeToken) {
        likesCount = token.likedParentToken?.likeTokens.length ?? 0
    }
    else {
        likesCount = token.likeTokens.length
    }

    const sharesCount = token.sharedChildTokens.length

    if (errorMessage) console.error('Token card metadata loading errror', errorMessage)

    const onCardClicked = () => {
        if (!useDummyMetadata) {
            navigate(buildTokenDetailRoute(token.contractAddress,BigNumber.from(token.tokenId)))
        }
    }

    const cardStyle = renderAsGridColumn ? {'textAlign': 'left', 'textDecoration': 'none', 'maxWidth':'100%'} : {'textAlign': 'left', 'textDecoration': 'none', 'max-width':'100%', 'width':'32em'};

    const renderConsentMissingCard = () => {
        return (
            <Card onClick={onCardClicked} centered={centered} style={cardStyle}>
                <Image rounded size='medium' className='Square' src={imageURL}/>
                <Card.Content className='No-top-border'>
                    <Card.Header>Owner consent missing</Card.Header>
                    <Card.Description>
                        Owner has to connect a wallet and sign consent before metadata will be available.
                    </Card.Description>
                </Card.Content>
                <TokenCardBottomIcons likesCount={likesCount} sharesCount={sharesCount}/>

            </Card>
        )
    }

    const renderCardWithData = () => {
        return <div>
            <Card onClick={onCardClicked} centered={centered} style={cardStyle}>
                
                <Image rounded size='medium' className='Square' src={imageURL} style={{'width': '100%'}}/>
                <TokenTypeFloatingLabel isOriginal={token.isOriginal} isSharedInstance={token.isSharedInstance} isLikeToken={token.isLikeToken} isEndorseToken={token.isEndorseToken}/>
                <Card.Content className='No-top-border'>
                    <Card.Header className='No-overflow'>{tokenHolderDisplayName}</Card.Header>
                    <Card.Description className='No-overflow'>
                        {tokenDisplayName}
                    </Card.Description>

                    {token.isEndorseToken ? 
                        <Card.Meta style={{margin: '1em 0 0 0'}}>“{metadata?.description}”</Card.Meta>
                        :
                        <Card.Meta style={{margin: '1em 0 0 0'}}>Category: {tokenCategory}</Card.Meta>
                    }
                </Card.Content>
                <TokenCardBottomIcons likesCount={likesCount} sharesCount={sharesCount}/>
            </Card>
        </div>
    }

    const renderContent = () => {

        if (showCardWhenDataMissing || alwaysShowCardEnvFlag) {
            if ( consentMissing ) {
                return renderConsentMissingCard()
            }
            else {
                return renderCardWithData()
            }
        }
    
        if ( consentMissing || !metadata ) {
            return <></>
        }
    
        return renderCardWithData()
    }

    const skipColumnIfCardIncomplete = () => {
        
        if (renderAsGridColumn && !consentMissing && !!metadata) {
            return <Grid.Column>
                {renderContent()}
            </Grid.Column>
        }
        else return renderContent()
    }

    return skipColumnIfCardIncomplete()
}

const TokenTypeFloatingLabel = ({isOriginal, isSharedInstance, isLikeToken, isEndorseToken}:{isOriginal: boolean, isSharedInstance: boolean, isLikeToken: boolean, isEndorseToken: boolean}) => {
    let labelText = 'N/A'
    if (isOriginal) labelText = 'ORIGINAL AWARD'
    else if (isSharedInstance) labelText = 'SHARED AWARD'
    else if (isLikeToken) labelText = 'LIKED AWARD'
    else if (isEndorseToken) labelText = 'ENDORSEMENT'

    return  <Rail attached internal  position='left' style={{margin: '10px'}}>
        <Label circular size='mini'>{labelText}</Label>
    </Rail>
}

const TokenCardBottomIcons = ({likesCount, sharesCount}:{likesCount: number, sharesCount: number}) => {
    return <Card.Content className='Card-footer'>
        <Grid columns={2} relaxed='very' centered stackable>
            <Grid.Column textAlign='center' >
                <Image src={icon_thumbsUp} ></Image>
                <span> {likesCount}</span>
            </Grid.Column>
            <Grid.Column textAlign='center'>    
                <Image src={icon_Share} ></Image>
                <span> {sharesCount}</span>
            </Grid.Column>
        </Grid>
    </Card.Content>
}

export default TokenGrid;
