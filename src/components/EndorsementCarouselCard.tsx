import { Slide } from "pure-react-carousel"
import React from "react"
import { Link } from "react-router-dom"
import { useMetadata } from "../hooks/hooks"
import { EndorseTokensOfTokenQuery_tokens } from "../queries-thegraph/types-thegraph/EndorseTokensOfTokenQuery"
import { buildWalletPageRoute } from "../routingUtils"
import { shortenAccountAddress } from "../utils"


export const EndorsementCarouselCard = ( { token, index }: { token: EndorseTokensOfTokenQuery_tokens, index: number } ) => {

    const [ tokenDisplayName, tokenHolderDisplayName, metadata, consentMissing, metadataErrorMessage ] = useMetadata(token)
   
    if (!metadata) return <></>
    
    return ( <Slide index={index} >
        <div className="EndorsementCarouselCard">
            <div className="EndorsementCarouselCardContent">
                <p>“{metadata?.description}”</p>
                <Link to={buildWalletPageRoute(token.ownerAddress)}>{shortenAccountAddress(token.ownerAddress)}</Link>
            </div>
        </div>
    </Slide>);
}