import { useQuery } from "@apollo/client"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { defaultErrorHandler } from "../graphql/errorHandlers"
import { theGraphApolloClient } from "../graphql/theGraphApolloClient"
import { useMetadata } from "../hooks/hooks"
import { GET_ENDORSE_TOKENS_OF_TOKEN } from "../queries-thegraph/queries"
import { EndorseTokensOfTokenQuery, EndorseTokensOfTokenQueryVariables, EndorseTokensOfTokenQuery_tokens } from "../queries-thegraph/types-thegraph/EndorseTokensOfTokenQuery"
import { buildWalletPageRoute } from "../routingUtils"
import { shortenAccountAddress } from "../utils"


export const EndorsementCarouselCard = ( { token }: { token: EndorseTokensOfTokenQuery_tokens } ) => {

    const [ tokenDisplayName, tokenHolderDisplayName, currentTokenmetadata, consentMissing, metadataErrorMessage ] = useMetadata(token)

    return (<div className="EndorsementCarouselCard">
        <div className="EndorsementCarouselCardContent">
            <p>{currentTokenmetadata?.description}</p>
            <Link to={buildWalletPageRoute(token.ownerAddress)}>{shortenAccountAddress(token.ownerAddress)}</Link>
        </div>
    </div>);
}