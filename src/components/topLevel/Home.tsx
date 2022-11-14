import React, { useState } from 'react';
import { useQuery } from '@apollo/client'
import { GET_TOKENS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import TokenGrid from '../../components/TokenGrid';
import { TokensQuery, TokensQueryVariables } from '../../queries-thegraph/types-thegraph/TokensQuery';
import { Header, Image } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { aboutRoute } from '../../routingUtils';
import { ALL_CATEGORIES_VALUE, TokenCategoryDropdown } from '../TokenCategoryDropdown';
import { projectId } from '../../utils';
import streamr_logo from '../../images/streamr_simple.svg'
import { SocialIcon } from 'react-social-icons';

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
            <div style={{'textAlign': 'left', padding: '5vh 10vw 7vh 10vw'}}>
                <Header className="No-overflow" as='h1'>Contribution awards to the Streamr community</Header>
                <p className='projectExplanation'>Streamr community award tokens (sNFT’s) are minted to community members to acknowledge their valuable contributions to the project and community. Read more <Link to={aboutRoute} onClick={() => navigate(aboutRoute)}>about this service.</Link></p>
                <div style={{'marginBottom': '2em'}}>
                    <Image src={streamr_logo} size='mini' style={{"display":"inline-block"}} as='a' href='https://streamr.network/'/>
                    <SocialIcon url="https://discord.gg/gZAm8P7hK8" label="Streamr Discord" style={{"height":"35px","width":"35px",'marginLeft':'15px'}} />
                    <SocialIcon url="https://twitter.com/streamr" label="Streamr Twitter" style={{"height":"35px","width":"35px",'marginLeft':'15px'}}/>
                </div>
                <TokenCategoryDropdown onCategoryChanged={(category) => setSelectedCategory(category)}/>
            </div>
            
            <TokenGrid tokens={allgraphShareTokensResult.data?.tokens || []} isLoading={allgraphShareTokensResult.loading}/>
        </div>
    )
}

export default Home