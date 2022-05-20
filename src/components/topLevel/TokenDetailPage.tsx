import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID } from "../../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";

const TokenDetailPage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'
    const subgraphTokenId = tokenId + '-' + contractAddress

    const tokenQuery = useQuery<ShareableTokenByIdQuery,ShareableTokenByIdQueryVariables>(GET_TOKEN_BY_ID, {client: theGraphApolloClient, pollInterval: 5000, variables: {id: subgraphTokenId}});
    const token = tokenQuery.data?.shareableToken
   
    if (tokenQuery.loading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            token? 
                <div>
                    <p> Token id is {tokenId}</p>
                    <div>
                        shared by {tokenQuery.data?.shareableToken?.sharedBy.map((sharingAccount,i) => 
                            <div key={`${sharingAccount}-${i}`}>{sharingAccount}</div>)}
                    </div>
                </div>
                :
                <div>
                    Token with id {tokenId} not found.
                </div>
        )
}

export default TokenDetailPage