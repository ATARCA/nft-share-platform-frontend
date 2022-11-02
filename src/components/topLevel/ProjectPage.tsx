import React, { useState } from 'react';
import { useQuery } from '@apollo/client'
import { GET_TOKENS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import TokenGrid from '../TokenGrid';
import { TokensQuery, TokensQueryVariables } from '../../queries-thegraph/types-thegraph/TokensQuery';
import { Header, Segment } from 'semantic-ui-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ALL_CATEGORIES_VALUE, TokenCategoryDropdown } from '../TokenCategoryDropdown';
import { streamrProjectId } from '../../utils';
import { useProjectDetails } from '../../hooks/hooks';
import { aboutRoute } from '../../routingUtils';

const ProjectPage = () => {

    const projectName = useParams().projectName || 'undefined'

    const [projectDetails, projectDetailsLoading] = useProjectDetails(projectName)

    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_VALUE);

    const projectId = projectDetails?.id || 'N/A'

    const navigate = useNavigate()

    const originalOrShareTokensResult = useQuery<TokensQuery,TokensQueryVariables>(GET_TOKENS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {isOriginalOrShared: true, category: selectedCategory, project: projectId}});

    const getProjectTitle = () => {
        if (projectId === streamrProjectId) return (
            <div>Contribution awards to the Streamr community</div>
        )
        else return (
            <div>Awards to the {projectDetails?.id} community</div>
        )
    }

    const getProjectDescription = () => {
        if (projectId === streamrProjectId) return (
            <div>Streamr community award tokens (sNFT’s) are minted to community members to acknowledge their valuable contributions to the project and community. Read more <Link to={aboutRoute} onClick={() => navigate(aboutRoute)}>about this service.</Link></div>
        )
        else return (
            <div>Award tokens (sNFT’s) are minted to community members to acknowledge their valuable contributions to the project and community. Read more <Link to={aboutRoute} onClick={() => navigate(aboutRoute)}>about this service.</Link></div>
        )
    }

    const renderProjectTitleAndDescription = () => { return (
        <div style={{'textAlign': 'left', padding: '5vh 10vw 7vh 10vw'}}>
            <Header className="No-overflow" as='h1'>{getProjectTitle()}</Header>
            <p style={{ padding: '3vh 30vw 3vh 0vw'}}>{getProjectDescription()}</p>
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
            <div>
                {renderProjectTitleAndDescription()}            
                <TokenGrid tokens={originalOrShareTokensResult.data?.tokens || []} isLoading={originalOrShareTokensResult.loading}/>
            </div>
        )
}

export default ProjectPage