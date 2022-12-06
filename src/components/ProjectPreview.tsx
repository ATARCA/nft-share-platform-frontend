import { useQuery } from "@apollo/client"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Header } from "semantic-ui-react"
import { defaultErrorHandler } from "../graphql/errorHandlers"
import { theGraphApolloClient } from "../graphql/theGraphApolloClient"
import { GET_FIRST_X_TOKENS } from "../queries-thegraph/queries"
import { FirstTokensQuery, FirstTokensQueryVariables } from "../queries-thegraph/types-thegraph/FirstTokensQuery"
import { buildProjectPageRoute } from "../routingUtils"
import TokenGrid from "./TokenGrid"

export const ProjectPreview = ( { projectId }: { projectId: string } ) => {

    const navigate = useNavigate()

    const first3TokensResult = useQuery<FirstTokensQuery, FirstTokensQueryVariables>(GET_FIRST_X_TOKENS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: { project: projectId, first:3}});

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
            tokens={first3TokensResult.data?.tokens || []} 
            isLoading={first3TokensResult.loading} 
            lastElement={getShowAllGridElement()}
            transparentBackground={true}
            columns={4}/>
    </div>);
}