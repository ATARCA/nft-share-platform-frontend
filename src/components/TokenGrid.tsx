import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Image, Segment } from 'semantic-ui-react';
import { OriginalTokenQuery_shareableTokens } from '../queries-thegraph/types-thegraph/OriginalTokenQuery';
import { buildTokenDetailRoute } from '../routingUtils';

export const TokenGrid = ({tokens, isLoading}: {tokens: OriginalTokenQuery_shareableTokens[], isLoading:boolean}) => {
    return (
        <div>
            {isLoading? 
                <Segment placeholder vertical padded='very' loading/>
                :
                <Grid doubling centered columns={5} style={{padding: '10vw'}}>
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

const TokenCard = ({token}: {token:OriginalTokenQuery_shareableTokens}) => {

    const navigate = useNavigate()

    const onCardClicked = () => {
        navigate(buildTokenDetailRoute(token.contractAddress,BigNumber.from(token.tokenId)))
    }

    return (
        <Card onClick={onCardClicked} style={{margin: '20px', textAlign: 'left'}}>
            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/paragraph.png'/>
            <Card.Content>
                <Card.Header>{token.id.toString().substring(0,7)}...</Card.Header>
                <Card.Meta>{token.tokenId} Meta info</Card.Meta>
                <Card.Description>
                    Token metadata description
                </Card.Description>
            </Card.Content>
            <Card.Content>
                    Under line content
            </Card.Content>
        </Card>
    )
}

export default TokenGrid;
