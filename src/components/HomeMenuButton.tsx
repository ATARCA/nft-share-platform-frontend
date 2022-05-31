import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const HomeMenuButton = () => {

    const navigate = useNavigate()

    return (
        <Menu.Item onClick={() => navigate('/')}>
            Talko (Home)
        </Menu.Item>
    )
}

export default HomeMenuButton