import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { hooks, metaMask as metamaskConnector } from "../connectors/metaMaskConnector";
import { useIsProjectOwner } from "../hooks/hooks";
import { buildWalletPageRoute, manageConsentRoute } from "../routingUtils";
import { shortenAccountAddress } from "../utils";
import { isDesiredChainID, MetaMaskConnectOnlyButton } from "./MetamaskConnectSubmenu";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks


const MainMenuWalletDropdown = () => {

    const accounts = useAccounts()
    const navigate = useNavigate()
    const active = useIsActive()
    const [isProjectOwner, projectDetailsLoading] = useIsProjectOwner()

    const chainID = useChainId()


    const getAccountLabel = () => {
        if (accounts) {
            return shortenAccountAddress(accounts[0])
        }
        else return 'No address'
    }

    const DisconnectItem = () => {
        const active = useIsActive()
    
        if (active) return <Dropdown.Item onClick={() => metamaskConnector.deactivate()}>Disconnect wallet</Dropdown.Item>
        return <></>
    }
    
    const MyWalletItem = () => {
        return <Dropdown.Item onClick={() => {if (accounts) navigate(buildWalletPageRoute(accounts[0]))}}>My wallet</Dropdown.Item>
    }

    const ManageConsentItem = () => {
        return <Dropdown.Item onClick={() => {navigate(manageConsentRoute)}}>Manage consent</Dropdown.Item>
    }

    if (active && isDesiredChainID(chainID)) return (
        <Menu.Menu position='right' style={{'zIndex':'99999'}}>
            <Menu.Item>
                <Dropdown  as={Button} className="Menu-dropdown-button" text={getAccountLabel()}>
                    <Dropdown.Menu> 
                        {isProjectOwner ? <Dropdown.Item onClick={() => navigate('mint')}>Mint a token</Dropdown.Item> : <></>}
                        <MyWalletItem/>
                        <ManageConsentItem/>
                        <DisconnectItem/>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu.Menu>
    )
    else return <></>
}

export default MainMenuWalletDropdown