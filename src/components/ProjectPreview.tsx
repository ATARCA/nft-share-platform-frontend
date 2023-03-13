import { useQuery } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Header } from "semantic-ui-react"
import { defaultErrorHandler } from "../graphql/errorHandlers"
import { theGraphApolloClient } from "../graphql/theGraphApolloClient"
import { useMetadata } from "../hooks/hooks"
import { GET_FIRST_X_TOKENS } from "../queries-thegraph/queries"
import { FirstTokensQuery, FirstTokensQueryVariables, FirstTokensQuery_tokens } from "../queries-thegraph/types-thegraph/FirstTokensQuery"
import { buildProjectPageRoute } from "../routingUtils"
import { NFTMetadata } from "../types/NFTMetadata"
import TokenGrid from "./TokenGrid"

export const ProjectPreview = ( { projectId }: { projectId: string } ) => {

    const navigate = useNavigate()

    const DESIRED_TOKEN_COUNT_W_METADATA = 3
    const LOADED_TOKEN_COUNT = 40

    const first20TokensResult = useQuery<FirstTokensQuery, FirstTokensQueryVariables>(GET_FIRST_X_TOKENS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: { project: projectId, first:LOADED_TOKEN_COUNT}});

    const tokens = first20TokensResult.data?.tokens

    const [tokensToRender, setTokensToRender] = useState<FirstTokensQuery_tokens[]>([]);

    interface TokenMetadataResult {
        token: FirstTokensQuery_tokens;
        hasMetadata: boolean;
    }

    useEffect(() => {

        const hasTokenMetadata = async (token: FirstTokensQuery_tokens): Promise<TokenMetadataResult> => {
            if (token.metadataUri) {
                const response = await fetch(token.metadataUri)
                return { token:token, hasMetadata:response.status === 200 }
            }
            return { token:token, hasMetadata:false }
        }

        const fetchMetadataForAllTokens = async () => {
            if (tokens) {
                const metadataPromises = tokens.map((token) => hasTokenMetadata(token));
                const metadataResults = await Promise.all(metadataPromises);
                const tokensWithMetadata = metadataResults.filter((it) => it.hasMetadata)
                setTokensToRender(tokensWithMetadata.slice(0,DESIRED_TOKEN_COUNT_W_METADATA).map((it) => it.token))
            }
        };
          
        fetchMetadataForAllTokens();
    }, [tokens]);

    const getShowAllGridElement = () => {return (
        <Link style={{display: 'inline-flex', alignItems: 'center' }} className="LinkWithoutLinkFormatting"  to={buildProjectPageRoute(projectId)} onClick={() => navigate(buildProjectPageRoute(projectId))}>
            <Grid.Column verticalAlign='middle' style={{alignItems: 'center', verticalAlign: 'middle'}}>
                View all {'→'}
            </Grid.Column>
        </Link>
    )}

    return (<div>
        <div style={{'textAlign': 'left', padding: '5vh 10vw 0vh 10vw'}}>
            <Header className="No-overflow" as='h1' >
                <Link className="LinkWithoutLinkFormatting"
                    to={buildProjectPageRoute(projectId)} onClick={() => navigate(buildProjectPageRoute(projectId))}>{projectId}
                </Link>
            </Header>

        </div>
        <TokenGrid 
            tokens={tokensToRender} 
            isLoading={first20TokensResult.loading} 
            lastElement={getShowAllGridElement()}
            transparentBackground={true}
            columns={4}/>
    </div>);
}