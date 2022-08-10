import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { hooks, metaMask as metamaskConnector } from "../connectors/metaMaskConnector";
import { useIsProjectOwner } from "../hooks/hooks";
import { shortenAccountAddress } from "../utils";
import { MetaMaskConnectOnlyButton } from "./MetamaskConnectSubmenu";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks


const MainMenuWalletDropdown = () => {

    const accounts = useAccounts()
    const navigate = useNavigate()
    const active = useIsActive()
    const [isProjectOwner, projectDetailsLoading] = useIsProjectOwner()

    const getAccountLabel = () => {
        if (accounts) {
            return shortenAccountAddress(accounts[0])
        }
        else return 'No address'
    }
    
    if (active) return (
        <Menu.Menu>
            <Menu.Item>
                <Dropdown  as={Button} className="Menu-dropdown-button" item text={getAccountLabel()}>
                    <Dropdown.Menu> 
                        {isProjectOwner ? <Dropdown.Item onClick={() => navigate('mint')}>Mint a token</Dropdown.Item> : <></>}
                        <DisconnectItem/>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu.Menu>
    )
    else return <></>
}

const DisconnectItem = () => {
    const active = useIsActive()

    if (active) return <Dropdown.Item onClick={() => metamaskConnector.deactivate()}>Disconnect wallet</Dropdown.Item>
    return <></>
}

export default MainMenuWalletDropdown