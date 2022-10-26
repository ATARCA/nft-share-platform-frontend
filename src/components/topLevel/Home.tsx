import React from 'react';
import { useQuery } from '@apollo/client'
import { GET_ALL_PROJECTS } from '../../queries-thegraph/queries';
import { theGraphApolloClient } from '../../graphql/theGraphApolloClient';
import { defaultErrorHandler } from '../../graphql/errorHandlers';
import { AllProjectsQuery } from '../../queries-thegraph/types-thegraph/AllProjectsQuery';
import { ProjectPreview } from '../ProjectPreview';

const Home = () => {
    const allProjectsResult = useQuery<AllProjectsQuery,undefined>(GET_ALL_PROJECTS, 
        {client: theGraphApolloClient, onError: defaultErrorHandler});

    return (
        <div>
            {allProjectsResult.data?.projects.map( project => <ProjectPreview key={project.id} projectId={project.id}/>)}
        </div>
    )
}

export default Home