import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import talco_logo from '../../images/talco_logo.svg';
import { Image } from "semantic-ui-react";
import { aboutRoute, buildProjectPageRoute } from "../../routingUtils";
import { useQuery } from "@apollo/client";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_ALL_PROJECTS } from "../../queries-thegraph/queries";
import { AllProjectsQuery } from "../../queries-thegraph/types-thegraph/AllProjectsQuery";
import { useCurrentProjectId } from "../../hooks/hooks";

const HomeMenuButtons = () => {

    const allProjectsResult = useQuery<AllProjectsQuery,undefined>(GET_ALL_PROJECTS, 
        {client: theGraphApolloClient, onError: defaultErrorHandler});

    const projectName = useCurrentProjectId() || 'yolo'
    //TODO load all projects
    //TODO smaller gap before dropdown arrow
    const navigate = useNavigate()
    const location = useLocation()

    const onProjectSelected = (projectId: string) => {
        console.log('selected',projectId)
    }

    const options = allProjectsResult.data?.projects.map( project => ({key: project.id, text:project.id, value:project.id}) ) 

    return (
        <Menu.Menu position="left">
            <Menu.Item onClick={() => navigate('/')}>
                <Image className='margin-vertical-main-menu' src={talco_logo} size='tiny'/>
            </Menu.Item>
            
            <Menu.Item name='projectName' onClick={() => navigate(buildProjectPageRoute(projectName))} active={ location.pathname === aboutRoute }/>          
            <Menu.Item style={{paddingLeft: '0', marginLeft: '0'}}>
                <Dropdown
                    onChange={ (event, data) => onProjectSelected(data.value?.toString()+'option1' || projectName)}
                    header='Choose community'
                    icon='caret down'
                    floating
                    direction='left'
                    options={options}
                    trigger={<></>}
                />
            </Menu.Item>
          
            <Menu.Item name='About' onClick={() => navigate(aboutRoute)} active={ location.pathname === aboutRoute }/>          
        </Menu.Menu>
    )
}

export default HomeMenuButtons