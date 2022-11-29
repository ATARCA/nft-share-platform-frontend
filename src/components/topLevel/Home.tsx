import React from 'react';
import { useQuery } from '@apollo/client'
import { GET_ALL_PROJECTS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import { AllProjectsQuery, AllProjectsQuery_projects } from '../../queries-thegraph/types-thegraph/AllProjectsQuery';
import { ProjectPreview } from '../ProjectPreview';
import { streamrProjectId } from '../../utils';

const Home = () => {
    const allProjectsResult = useQuery<AllProjectsQuery,undefined>(GET_ALL_PROJECTS, 
        {client: theGraphApolloClient, onError: defaultErrorHandler});

    const getProjectListWithStreamrProjectFirst = (projects: AllProjectsQuery_projects[] | undefined) => {
        const streamrProject = projects?.find( (project) => project.id === streamrProjectId)
        const sortedProjects = projects?.filter((project) => project.id !== streamrProjectId)
        
        if (streamrProject) sortedProjects?.unshift(streamrProject)

        return sortedProjects
    }

    const projectsToDisplay = getProjectListWithStreamrProjectFirst(allProjectsResult.data?.projects)

    return (
        <div className='TokenGridBackground'>
            {projectsToDisplay?.map( project => <ProjectPreview key={project.id} projectId={project.id}/>)}
        </div>
    )
}

export default Home