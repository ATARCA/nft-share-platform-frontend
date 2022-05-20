import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID } from "../../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables } from "../../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import { NFTMetadata } from "../../../types/NFTMetadata";
import TokenAttributesView from "../TokenAttributesView";

const TokenDetailPage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'
    const subgraphTokenId = tokenId + '-' + contractAddress

    const [ metadata, setMetadata ] = useState<NFTMetadata|undefined>(undefined)

    const tokenQuery = useQuery<ShareableTokenByIdQuery,ShareableTokenByIdQueryVariables>(GET_TOKEN_BY_ID, {client: theGraphApolloClient, pollInterval: 5000, variables: {id: subgraphTokenId}});
    const token = tokenQuery.data?.shareableToken

    const buildMetadataUri = (contractAddress: string, tokenId: string) => {
        //TODO after updating to new contracts load URI contract or subgraph - do not build it here
        return `${process.env.REACT_APP_BACKEND_URI}/metadata/${contractAddress}/${tokenId}`
    }

    useEffect( () => {
        const fetchMetadata = async () => {
            const uri = buildMetadataUri(contractAddress, tokenId)
            const response = await fetch(uri)
            console.log('metadata response',response)

            if (response && response.status === 200) {
                const body = await response.json()
                const metadata = body as NFTMetadata
                setMetadata(metadata)
            }
        }
    
        fetchMetadata()
    },[contractAddress, tokenId])
   
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
                    {metadata?.attributes ? <TokenAttributesView attributes={metadata.attributes}/> : <></>}
                </div>
                :
                <div>
                    Token with id {tokenId} not found.
                </div>
        )
}

export default TokenDetailPage