import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import icon_thumbsUp from '../images/icon_ThumbsUp.svg';
import icon_Share from '../images/icon_ShareNetwork.svg';

import { useNavigate } from 'react-router-dom';
import { Card, Grid, Icon, Image, Segment } from 'semantic-ui-react';
import { useMetadata } from '../hooks/hooks';
import { TokensQuery_shareableTokens } from '../queries-thegraph/types-thegraph/TokensQuery';
import { buildTokenDetailRoute } from '../routingUtils';

export const TokenGrid = ({tokens, isLoading}: {tokens: TokensQuery_shareableTokens[], isLoading:boolean}) => {
    return (
        <div>
            {isLoading? 
                <Segment placeholder vertical padded='very' loading/>
                :
                <Grid doubling centered columns={4} style={{padding: '10vw'}}>
                    {tokens.map(t => 
                        <Grid.Column key={t.id}>
                            <TokenCard token={t}/>
                        </Grid.Column>
                    )}
                </Grid>
            }
        </div>
    );
};

const TokenCard = ({token}: {token:TokensQuery_shareableTokens}) => {

    const navigate = useNavigate()
    const [metadata, consentMissing, errorMessage] = useMetadata(token.contractAddress, token.tokenId)

    const imageURL = metadata?.image ? metadata.image : 'https://react.semantic-ui.com/images/wireframe/paragraph.png'
    
    const tokenHolderNameOriginal = metadata?.attributes.find((attribute) => attribute.trait_type === 'Author')?.value //TODO extract these strings
    const tokenHolderNameSubcontributor = metadata?.attributes.find((attribute) => attribute.trait_type === 'subcontributor')?.value //TODO extract these strings
    const tokenHolderDisplayName = tokenHolderNameSubcontributor ? tokenHolderNameSubcontributor : tokenHolderNameOriginal

    const tokenName = metadata?.name
    const tokenSubcontributionName = metadata?.attributes.find((attribute) => attribute.trait_type === 'subcontribution title')?.value //TODO extract these strings
    const tokenDisplayName = tokenSubcontributionName ? tokenSubcontributionName : tokenName

    const tokenCategory = metadata?.attributes.find((attribute) => attribute.trait_type === 'Category')?.value //TODO extract these strings

    let likesCount
    if (token.isLikeToken) {
        likesCount = token.likedParentToken?.likeTokens.length ?? 0
    }
    else {
        likesCount = token.likeTokens.length
    }

    const sharesCount = token.sharedChildTokens.length

    if (errorMessage) console.error('Token card metadata loading errror', errorMessage)

    const onCardClicked = () => {
        navigate(buildTokenDetailRoute(token.contractAddress,BigNumber.from(token.tokenId)))
    }

    //TODO add label tag in corner

    if (consentMissing)
        return (
            <Card onClick={onCardClicked} style={{margin: '20px', textAlign: 'left'}}>
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
    else return (
        <Card onClick={onCardClicked} style={{margin: '20px', textAlign: 'left'}}>
            <Image rounded size='medium' className='Square' src={imageURL}/>
            <Card.Content className='No-top-border'>
                <Card.Header>{tokenHolderDisplayName}</Card.Header>
                <Card.Description>
                    {tokenDisplayName}
                </Card.Description>
                <Card.Meta>Category: {tokenCategory}</Card.Meta>
            </Card.Content>
            <TokenCardBottomIcons likesCount={likesCount} sharesCount={sharesCount}/>
        </Card>
    )
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
