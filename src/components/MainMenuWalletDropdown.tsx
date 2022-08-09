import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { hooks } from "../connectors/metaMaskConnector";
import { useIsProjectOwner } from "../hooks/hooks";
import { shortenAccountAddress } from "../utils";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks


const MainMenuWalletDropdown = () => {

    const accounts = useAccounts()
    const navigate = useNavigate()
    const [isProjectOwner, projectDetailsLoading] = useIsProjectOwner()

    const getAccountLabel = () => {
        if (accounts) {
            return shortenAccountAddress(accounts[0])
        }
        else return 'No address'
    }
    return (
        <Menu.Menu>
            <Menu.Item>
                <Dropdown  as={Button} className="Menu-dropdown-button" item text={getAccountLabel()}>
                    <Dropdown.Menu> 
                        {isProjectOwner ? <Dropdown.Item onClick={() => navigate('mint')}>Mint a token</Dropdown.Item> : <></>}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        </Menu.Menu>
    )
}

export default MainMenuWalletDropdown