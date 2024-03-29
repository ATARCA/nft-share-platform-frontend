import React, { useEffect } from "react";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import talco_logo from '../../images/talco_logo.svg';
import { Image } from "semantic-ui-react";
import { aboutRoute, buildProjectPageRoute, faqRoute, homeRoute, walletDetailRoute } from "../../routingUtils";
import { useQuery } from "@apollo/client";
import { defaultErrorHandler } from "../../graphql/errorHandlers";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";
import { GET_ALL_PROJECTS } from "../../queries-thegraph/queries";
import { AllProjectsQuery, AllProjectsQueryVariables, AllProjectsQuery_projects  } from "../../queries-thegraph/types-thegraph/AllProjectsQuery";
import { useCurrentProjectId, useLastVisitedProjectCookie } from "../../hooks/hooks";
import { createSecretKey } from "crypto";

const HomeMenuNavigationButtons = () => {

    const allProjectsResult = useQuery<AllProjectsQuery,AllProjectsQueryVariables>(GET_ALL_PROJECTS, 
        {client: theGraphApolloClient, onError: defaultErrorHandler, variables: { filterId: process.env.REACT_APP_FILTER_OUT_PROJECT ?? '' }});

    const [lastVisitedProject, setLastVisitedProject] = useLastVisitedProjectCookie()
    const projectName = useCurrentProjectId() ||  lastVisitedProject

    const walletDetailRouteMatch = useMatch({path: walletDetailRoute});

    useEffect(() => {
        setLastVisitedProject(projectName)
    }, [projectName, setLastVisitedProject])

    const navigate = useNavigate()
    const location = useLocation()

    const onProjectSelected = (projectId: string) => {
        navigate(buildProjectPageRoute(projectId))
    }

    const options = allProjectsResult.data?.projects.map( project => ({key: project.id, text:project.id, value:project.id}) ); 

    const renderProjectSelectionItems = () => {
        if (location.pathname === homeRoute || 
            location.pathname === aboutRoute ||
            location.pathname === faqRoute ||
            walletDetailRouteMatch !== null) return <></>
        else return <>
            <Menu.Item name={projectName} onClick={() => navigate(buildProjectPageRoute(projectName))}/>          
            <Menu.Item style={{paddingLeft: '0', marginLeft: '0'}}>
                <Dropdown
                    onChange={ (event, data) => onProjectSelected(data.value?.toString() || projectName)}
                    header='Choose community'
                    icon='caret down'
                    floating
                    value={projectName}
                    direction='left'
                    options={options}
                    trigger={<></>}
                />
            </Menu.Item>
        </>
    }

    return (
        <Menu.Menu position="left">
            <Menu.Item onClick={() => navigate('/')}>
                <Image className='margin-vertical-main-menu' src={talco_logo} size='tiny'/>
            </Menu.Item>
            
            {renderProjectSelectionItems()}
          
            <Menu.Item name='About' onClick={() => navigate(aboutRoute)} active={ location.pathname === aboutRoute }/>          
            <Menu.Item name='FAQ' onClick={() => navigate(faqRoute)} active={ location.pathname === faqRoute }/>          
        </Menu.Menu>
    )
}

export default HomeMenuNavigationButtons
