import React from 'react';
import { Card, Grid, Image, Segment } from 'semantic-ui-react';
import { ShareableTokenQuery_shareableTokens } from '../queries-thegraph/types-thegraph/ShareableTokenQuery';

export const TokenGrid = ({tokens, isLoading}: {tokens: ShareableTokenQuery_shareableTokens[], isLoading:boolean}) => {
    return (
        <div>
            {isLoading? 
                <Segment placeholder vertical padded='very' loading>
                </Segment>
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

const TokenCard = ({token}: {token:ShareableTokenQuery_shareableTokens}) => {
    return (
        <Card style={{margin: '20px', textAlign: 'left'}}>
            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/paragraph.png'/>
            <Card.Content>
                <Card.Header>{token.id.toString().substring(0,7)}...</Card.Header>
                <Card.Meta>Meta info</Card.Meta>
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
