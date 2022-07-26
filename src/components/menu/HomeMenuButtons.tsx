import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Menu } from "semantic-ui-react";
import talco_logo from '../../images/talco_logo.svg';
import { Image } from "semantic-ui-react";
import { aboutRoute } from "../../routingUtils";


const HomeMenuButtons = () => {

    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Menu.Menu position="left">
            <Menu.Item onClick={() => navigate('/')}>
                <Image className='margin-vertical-main-menu' src={talco_logo} size='tiny'/>
            </Menu.Item>
            <Menu.Item name='About' onClick={() => navigate(aboutRoute)} active={ location.pathname === aboutRoute }/>          
        </Menu.Menu>
    )
}

export default HomeMenuButtons