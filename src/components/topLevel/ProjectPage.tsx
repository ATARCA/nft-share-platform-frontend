import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client'
import { GET_TOKENS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import TokenGrid from '../TokenGrid';
import { TokensQuery, TokensQueryVariables, TokensQuery_tokens } from '../../queries-thegraph/types-thegraph/TokensQuery';
import { Header, Segment, Image } from 'semantic-ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ALL_CATEGORIES_VALUE, TokenCategoryDropdown } from '../TokenCategoryDropdown';
import { streamrProjectId } from '../../utils';
import { useProjectDetails } from '../../hooks/hooks';
import { aboutRoute } from '../../routingUtils';
import streamr_logo from '../../images/streamr_simple.svg'
import { SocialIcon } from 'react-social-icons';
import InfiniteScroll from "react-infinite-scroll-component";


const ProjectPage = () => {

    const projectName = useParams().projectName || 'undefined'

    const [projectDetails, projectDetailsLoading] = useProjectDetails(projectName)

    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_VALUE);

    const projectId = projectDetails?.id || 'N/A'

    const navigate = useNavigate()

    const infiniteScrollLoadStep = 24;
    const [firstXtokens, setFirstXTokens] = useState(infiniteScrollLoadStep);

    const fetchMoreData = () => {
        setFirstXTokens(firstXtokens+infiniteScrollLoadStep)       
    }

    const originalOrShareTokensResult = useQuery<TokensQuery,TokensQueryVariables>(GET_TOKENS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {isOriginalOrShared: true, category: selectedCategory, project: projectId, first: firstXtokens}});

    const [tokensToRender, setTokensToRender] = useState<TokensQuery_tokens[]>([]);

    useEffect(() => {
        if ((originalOrShareTokensResult.data?.tokens || []).length !== 0) {
            setTokensToRender(originalOrShareTokensResult.data?.tokens || [])
        }
    },[originalOrShareTokensResult.data?.tokens])

    const getProjectTitle = () => {
        if (projectId === streamrProjectId) return (
            <div>Streamr community contribution awards!</div>
        )
        else return (
            <div>Awards to the {projectDetails?.id} community</div>
        )
    }

    const getProjectDescription = () => {
        if (projectId === streamrProjectId) return (
            <div>
                <p>Streamr Awards are a new type of token (sNFTs) minted to acknowledge the valuable contributions made by Streamr community members.</p>
                <p>Browse, Like, and Share the awards!</p>
            </div>
        )
        else return (
            <div>Award tokens (sNFT’s) are minted to community members to acknowledge their valuable contributions to the project and community. Read more <Link to={aboutRoute} onClick={() => navigate(aboutRoute)}>about this service.</Link></div>
        )
    }

    const getSocialLinks = () => {
        if (projectId === streamrProjectId) return (
            <div style={{'marginBottom': '2em'}}>
                <Image src={streamr_logo} size='mini' style={{"display":"inline-block"}} as='a' href='https://streamr.network/'/>
                <SocialIcon url="https://discord.gg/gZAm8P7hK8" label="Streamr Discord" style={{"height":"35px","width":"35px",'marginLeft':'15px'}} />
                <SocialIcon url="https://twitter.com/streamr" label="Streamr Twitter" style={{"height":"35px","width":"35px",'marginLeft':'15px'}}/>
            </div>
        )
        else return (
            <></>
        )
    }

    const renderProjectTitleAndDescription = () => { return (
        <div style={{'textAlign': 'left', padding: '5vh 10vw 7vh 10vw'}}>
            <Header className="No-overflow" as='h1'>{getProjectTitle()}</Header>
            <p style={{ padding: '3vh 15vw 3vh 0vw'}}>{getProjectDescription()}</p>
            {getSocialLinks()}
            <TokenCategoryDropdown projectId={projectId} onCategoryChanged={(category) => setSelectedCategory(category)}/>
        </div>   
    )
    }

    if (projectDetailsLoading) return (
        <Segment placeholder vertical padded='very' loading/>
    )
    else if (!projectDetails) return (
        <p style={{ padding: '10vh 10vw 30vh 10vw'}}>Project {projectName} not found.</p>

    )
    else
        return (
            <div >
                {renderProjectTitleAndDescription()}      
                <div id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={tokensToRender.length}
                        next={fetchMoreData}
                        hasMore={tokensToRender.length + infiniteScrollLoadStep >= firstXtokens}
                        loader={<Segment placeholder vertical padded='very' loading/>}>
                        <TokenGrid tokens={tokensToRender} isLoading={originalOrShareTokensResult.loading && tokensToRender.length === 0}/>
                    </InfiniteScroll>    
                </div>
            </div>
        )
}

export default ProjectPage