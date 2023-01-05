import { useQuery } from "@apollo/client"
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from "pure-react-carousel"
import React from "react"
import carousel_arrow_right from '../images/carousel_arrow_right.png';
import carousel_arrow_left from '../images/carousel_arrow_left.png';

import { Image } from "semantic-ui-react"
import { defaultErrorHandler } from "../graphql/errorHandlers"
import { theGraphApolloClient } from "../graphql/theGraphApolloClient"
import { GET_ENDORSE_TOKENS_OF_TOKEN } from "../queries-thegraph/queries"
import { EndorseTokensOfTokenQuery, EndorseTokensOfTokenQueryVariables } from "../queries-thegraph/types-thegraph/EndorseTokensOfTokenQuery"
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery"
import { EndorsementCarouselCard } from "./EndorsementCarouselCard"

export const EndorsementCarousel = ( { parentToken }: { parentToken: TokenByIdQuery_token } ) => {

    const endorseTokensResult = useQuery<EndorseTokensOfTokenQuery, EndorseTokensOfTokenQueryVariables>(GET_ENDORSE_TOKENS_OF_TOKEN, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: { parentTokenEntityId: parentToken.id,}});

    const totalSlides = (endorseTokensResult.data?.tokens.length || 0)
    const visibleSlidesCount = getComputedStyle(document.documentElement).getPropertyValue('--endorsement-carousel-visible-cards')

    return (<div className="EndorsementCarouselBackground">
        <CarouselProvider
            naturalSlideWidth={2}
            naturalSlideHeight={1}
            totalSlides={totalSlides }
            visibleSlides={Math.min(totalSlides,Number.parseInt(visibleSlidesCount))}
            isIntrinsicHeight={true}
            infinite={true}>
                
            <div style={{ position: 'relative'}}>
                <Slider style={{ padding: '0 9vh 0 9vh'}}>
                    {endorseTokensResult.data?.tokens.map((token, i) => 
                        <Slide  index={i} key={i}>
                            <EndorsementCarouselCard key={token.id} token={token} />
                        </Slide>)}
                </Slider>
             
                <Image as={ButtonBack} size={"tiny"} style={{position: 'absolute', top: '40%', left: '0', borderStyle: 'none'}} 
                    src={carousel_arrow_left}/>

                <Image as={ButtonNext} style={{position: 'absolute', top: '40%', right: '0', borderStyle: 'none'}} 
                    src={carousel_arrow_right}/>
            </div>

        </CarouselProvider>
      
    </div>);
}