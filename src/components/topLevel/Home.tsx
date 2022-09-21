import React, { useState } from 'react';
import { useQuery } from '@apollo/client'
import { GET_TOKENS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import TokenGrid from '../../components/TokenGrid';
import OnboardingCarousel from '../onboarding/OnboardingCarousel';
import { TokensQuery, TokensQueryVariables } from '../../queries-thegraph/types-thegraph/TokensQuery';
import { Header } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { aboutRoute } from '../../routingUtils';
import { ALL_CATEGORIES_VALUE, TokenCategoryDropdown } from '../TokenCategoryDropdown';
import { projectId } from '../../utils';

const Home = () => {

    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_VALUE);

    const navigate = useNavigate()

    const allgraphShareTokensResult = useQuery<TokensQuery,TokensQueryVariables>(GET_TOKENS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {isOriginalOrShared: true, category: selectedCategory, project: projectId}});

    return (
        <div>
            <OnboardingCarousel/>
            <div style={{'textAlign': 'left', padding: '5vh 10vw 15vh 10vw'}}>
                <Header className="No-overflow" as='h1'>Contribution awards to the Streamr community</Header>
                <p style={{ padding: '3vh 30vw 0vh 0vw'}}>Streamr community award tokens (sNFT’s) are minted to community members to acknowledge their valuable contributions to the project and community. Read more <Link to={aboutRoute} onClick={() => navigate(aboutRoute)}>about this service.</Link></p>
                <TokenCategoryDropdown onCategoryChanged={(category) => setSelectedCategory(category)}/>
            </div>
            
            <TokenGrid tokens={allgraphShareTokensResult.data?.tokens || []} isLoading={allgraphShareTokensResult.loading}/>
        </div>
    )
}

export default Home