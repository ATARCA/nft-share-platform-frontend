import React from 'react';
import { useQuery } from '@apollo/client'
import { GET_ALL_PROJECTS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import { AllProjectsQuery, AllProjectsQueryVariables, AllProjectsQuery_projects } from '../../queries-thegraph/types-thegraph/AllProjectsQuery';
import { ProjectPreview } from '../ProjectPreview';
import { streamrProjectId } from '../../utils';
import { Segment } from 'semantic-ui-react';

const Home = () => {
    
    const allProjectsResult = useQuery<AllProjectsQuery,AllProjectsQueryVariables>(GET_ALL_PROJECTS, 
        {client: theGraphApolloClient, onError: defaultErrorHandler, variables: { filterId: process.env.REACT_APP_FILTER_OUT_PROJECT ?? ''}});

    const getProjectListWithStreamrProjectFirst = (projects: AllProjectsQuery_projects[] | undefined) => {
        const streamrProject = projects?.find( (project) => project.id === streamrProjectId)
        const sortedProjects = projects?.filter((project) => project.id !== streamrProjectId)
        
        if (streamrProject) sortedProjects?.unshift(streamrProject)

        return sortedProjects
    }

    const projectsToDisplay = getProjectListWithStreamrProjectFirst(allProjectsResult.data?.projects)

    return (
        <div className='TokenGridBackground'>
            {allProjectsResult.loading ? <Segment placeholder vertical padded='very' loading/> : <></>}
            
            {projectsToDisplay?.map( project => <ProjectPreview key={project.id} projectId={project.id}/>)}
        </div>
    )
}

export default Home