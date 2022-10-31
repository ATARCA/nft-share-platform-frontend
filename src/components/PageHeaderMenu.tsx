import React from "react";
import { Divider, Menu } from "semantic-ui-react";
import ConsentPanel from "./ConsentPanel";
import MainMenuWalletDropdown from "./MainMenuWalletDropdown";
import HomeMenuNavigationButtons from "./menu/HomeMenuButtons";
import MetamaskConnectSubMenu from "./MetamaskConnectSubmenu";

const PageHeaderMenu = () => {

    return (
        <>
            <Menu secondary stackable={true}>
                <HomeMenuNavigationButtons/>
                <MetamaskConnectSubMenu/>    
                <MainMenuWalletDropdown/>
            </Menu>
            <Divider fitted />
            <ConsentPanel/>
        </>
    );
}

export default PageHeaderMenu;