import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { Message, Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID } from "../../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import TokenAttributesView from "../TokenAttributesView";
import { useMetadata } from "../../hooks/hooks";

const TokenDetailPage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'
    const subgraphTokenId = tokenId + '-' + contractAddress

    const tokenQuery = useQuery<ShareableTokenByIdQuery,ShareableTokenByIdQueryVariables>(GET_TOKEN_BY_ID, {client: theGraphApolloClient, pollInterval: 5000, variables: {id: subgraphTokenId}});
    const token = tokenQuery.data?.shareableToken

    const [ metadata, consentMissing, errorMessage ] = useMetadata(contractAddress, tokenId)

    const renderMetadataAttributes = () => {
        return <div>{metadata?.attributes ? <TokenAttributesView attributes={metadata.attributes}/> : <></>}</div>
    }
   
    if (tokenQuery.loading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else
        return (
            token? 
                <div>
                    <p> Token id is {tokenId}</p>
                    <div>
                        shared by {token.sharedBy.map((sharingAccount,i) => 
                            <div key={`${sharingAccount}-${i}`}>{sharingAccount}</div>)}
                    </div>
                    {consentMissing ? <div>Consent for this metadata is missing. If you hold this token, connect your wallet to give consent and publish this metadata.</div> 
                        : renderMetadataAttributes()}
                    {errorMessage ? <Message error header='Error when loading metadata' content={errorMessage}/> : <></>}
                    
                    
                </div>
                :
                <div>
                    Token with id {tokenId} not found.
                </div>
        )
}

export default TokenDetailPage