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

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider } = hooks

const ChainDetails = () => {
    const chainId = useChainId()
    const active = useIsActive()

    return (
        active ?
            <Menu.Item>

                <label>
            Chain:  {chainId ? CHAINS[chainId].name : '-'}
                </label>
            </Menu.Item>

            : <></>
    )
}

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

const isDesiredChainID = (chainId: number | undefined) => {
    return chainId === DESIRED_CHAIN_ID
}

const MetaMaskConnect = ({connector}: {connector: MetaMask}) => {
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
            <Button onClick={() => connector.deactivate()}>Disconnect</Button>
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

const Status = ({connector}: { connector: Connector }) => {
    const chainId = useChainId()
    const error = useError()
    const isActive = useIsActive()
  
    if (error) return (
        <Menu.Item>{error.name ?? 'Error'}: {error.message} </Menu.Item>
    )

    if (isActive) 
        if(isDesiredChainID(chainId)) return (
            <Menu.Item>✅ Connected </Menu.Item>
        )
        else return (
            <Menu.Item>⚠️ Switch network </Menu.Item>
        )
    else return (
        <Menu.Item>⚠️ Disconnected </Menu.Item>
    )
}

const Accounts = () => {
    const provider = useProvider()
    const accounts = useAccounts()
    const chainId = useChainId()
    const isActive = useIsActive()

    const shortenedAccounts = accounts?.map(a => shortenAccountAddress(a))


    const balances = useBalances(provider, accounts)

    return (
        isActive ?
            <Menu.Item>
                <div>
                    Account:
                    {accounts === undefined
                        ? ' -'
                        : accounts.length === 0
                            ? ' None'
                            : shortenedAccounts?.map((account, i) => (
                                <ul key={account} style={{ margin: 0, padding:0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <b>{account}</b>
                                    {balances?.[i] ? ` (${formatEther(balances[i])} ${getCurrencySymbol(chainId)})` : null}
                                </ul>
                            ))}
                </div>
            </Menu.Item> 
            : <></>
    )
}

const shortenAccountAddress = (address: string) : string => {
    return address.substring(0,5) + '...' + address.substring(address.length - 4)
}


const getCurrencySymbol = (chainId: number | undefined): string => {
    if (chainId) {
        const chain = CHAINS[chainId]
        const extendedInfoChain = chain as ExtendedChainInformation
        if (extendedInfoChain.nativeCurrency) {
            return extendedInfoChain.nativeCurrency.symbol
        }
    }

    return 'Ξ'
}

const useBalances = (
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined => {
    const [balances, setBalances] = useState<BigNumber[] | undefined>()
  
    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false
  
            void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
                if (!stale) {
                    setBalances(balances)
                }
            })
  
            return () => {
                stale = true
                setBalances(undefined)
            }
        }
    }, [provider, accounts])
  
    return balances
}

export const MetamaskConnectSubMenu = () => {
    return (          
        <Menu.Menu position='right'>
           
            <Status  connector={metamaskConnector}/>
            <ChainDetails/>
           
            <Accounts />
           
            <SwitchNetworkButton connector={metamaskConnector}/>       

            <Menu.Item>
                <MetaMaskConnect connector={metamaskConnector}/>
            </Menu.Item>
        </Menu.Menu>
    )
}

export default MetamaskConnectSubMenu