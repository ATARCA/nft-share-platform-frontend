import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import { hooks } from "../connectors/metaMaskConnector";
import { shortenAccountAddress } from "../utils";

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks


const MainMenuDropdown = () => {

    const accounts = useAccounts()
    const navigate = useNavigate()

    const getAccountLabel = () => {
        if (accounts) {
            return shortenAccountAddress(accounts[0])
        }
        else return 'No address'
    }

    return (
        <Dropdown item text={getAccountLabel()}>
            <Dropdown.Menu> 
                <Dropdown.Item onClick={() => navigate('mint')}>Mint</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default MainMenuDropdown