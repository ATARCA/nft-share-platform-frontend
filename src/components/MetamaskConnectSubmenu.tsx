import { MetaMask } from '@web3-react/metamask';
import { Web3ReactHooks } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'
import { useEffect, useState } from 'react';
import { CHAINS, getAddChainParameters, ExtendedChainInformation, DESIRED_CHAIN_ID } from '../chains'
import { BigNumber } from '@ethersproject/bignumber'
import React from 'react';
import type { Connector } from '@web3-react/types'
import { hooks, metaMask as metamaskConnector } from '../connectors/metaMaskConnector'
import { Button, Menu } from 'semantic-ui-react';
import { shortenAccountAddress } from '../utils';

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks

const SwitchNetworkButton = ( {connector}: {connector: MetaMask} ) => {
    const chainID = useChainId()
    const active = useIsActive()

    const desiredChainName = CHAINS[DESIRED_CHAIN_ID].name

    return (
        !isDesiredChainID(chainID) && active ? 
            <Menu.Item>
                <Button primary onClick={() => connector.activate(getAddChainParameters(DESIRED_CHAIN_ID))}>Switch to {desiredChainName}</Button>
            </Menu.Item>
            : <></> 
    )
}

export const isDesiredChainID = (chainId: number | undefined) => {
    return chainId === DESIRED_CHAIN_ID
}

export const MetaMaskConnectOnlyButton = ({connector}: {connector: MetaMask}) => {
    const isActivating = useIsActivating()
    const error = useError()
    const active = useIsActive()
  
    if (error) {
        return (    
            <Button secondary
                onClick={() => connector.activate( getAddChainParameters(DESIRED_CHAIN_ID))}
            >
            Try Again? 
            </Button>
        )
    } else if (active) {
        return (
            <></>
        )
    } else {
        return (
            <Button primary loading={isActivating}
                onClick={
                    isActivating
                        ? undefined
                        : () => connector.activate( getAddChainParameters(DESIRED_CHAIN_ID))
                }
                disabled={isActivating}
            >
                {isActivating ? 'Connecting...' : `Connect ${getName(connector)}`}
            </Button>
        )
    }
}

const getName = (connector: Connector) => {
    if (connector instanceof MetaMask) {
        return 'MetaMask'
    } else {
        return 'Unknown'
    }
}

const SwitchNetworkWarning = ({connector}: { connector: Connector }) => {
    const chainId = useChainId()
    const error = useError()
    const isActive = useIsActive()
  
    if (error) return (
        <Menu.Item>{error.name ?? 'Error'}: {error.message} </Menu.Item>
    )

    if (isActive) 
        if(!isDesiredChainID(chainId)) return (
            <Menu.Item>⚠️ Switch network </Menu.Item>
        )
    return <></>
}




export const MetamaskConnectSubMenu = () => {
    return (          
        <Menu.Menu position='right'>
           
            <SwitchNetworkWarning  connector={metamaskConnector}/>
                      
            <SwitchNetworkButton connector={metamaskConnector}/>       

            <Menu.Item>
                <MetaMaskConnectOnlyButton connector={metamaskConnector}/>
            </Menu.Item>
        </Menu.Menu>
    )
}

export default MetamaskConnectSubMenu