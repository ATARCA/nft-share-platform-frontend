import { MetaMask } from '@web3-react/metamask';
import { Web3ReactHooks } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'
import { useCallback, useEffect, useState } from 'react';
import { CHAINS, getAddChainParameters, URLS, ExtendedChainInformation, DESIRED_CHAIN_ID } from '../chains'
import { BigNumber } from '@ethersproject/bignumber'
import React from 'react';
import type { Connector } from '@web3-react/types'
import { hooks, metaMask as metamaskConnector } from '../connectors/metaMaskConnector'

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

function MetaMaskChainSelect({ chainId, setChainId }: { chainId: number; setChainId?: (chainId: number) => void }) {
    return (
        <label>
        Chain:{' '}
            <select
                value={`${chainId}`}
                onChange={
                    setChainId
                        ? (event) => {
                            setChainId(Number(event.target.value))
                        }
                        : undefined
                }
                disabled={!setChainId}
            >
                <option value={-1}>Default</option>
                {Object.keys(URLS).map((chainId) => (
                    <option key={chainId} value={chainId}>
                        {CHAINS[Number(chainId)].name}
                    </option>
                ))}
            </select>
        </label>
    )
}

function ChainDetails() {
    const chainId = useChainId()

    return (
        <label>
            Chain:  {chainId ? CHAINS[chainId].name : '-'}
        </label>
    )
}

function SwitchNetworkButton( {connector}: {connector: MetaMask} ) {
    const chainID = useChainId()
    const active = useIsActive()

    const desiredChainName = CHAINS[DESIRED_CHAIN_ID].name

    return (
        isDesiredChainID(chainID) && !active ? <></> :
            <button onClick={() => connector.activate(getAddChainParameters(DESIRED_CHAIN_ID))}>Switch to {desiredChainName}</button>
    )
}

function isDesiredChainID(chainId: number | undefined) {
    return chainId === DESIRED_CHAIN_ID
}

function MetaMaskConnect({
    connector,
    hooks: { useChainId, useIsActivating, useError, useIsActive },
}: {
    connector: MetaMask
    hooks: Web3ReactHooks
  }) {
    const currentChainId = useChainId()
    const isActivating = useIsActivating()
    const error = useError()
    const active = useIsActive()
  
    const [desiredChainId, setDesiredChainId] = useState<number>(-1)
  
    const setChainId = useCallback(
        (chainId: number) => {
            setDesiredChainId(chainId)
            if (chainId !== -1 && chainId !== currentChainId) {
                return connector.activate(getAddChainParameters(chainId))
            }
        },
        [setDesiredChainId, currentChainId, connector]
    )
  
    if (error) {
        return (
            <>
                <MetaMaskChainSelect chainId={desiredChainId} setChainId={setChainId} />
                <br />
                <button
                    onClick={() => connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))}
                >
            Try Again? 
                </button>
            </>
        )
    } else if (active) {
        return (
            <>
                <MetaMaskChainSelect chainId={desiredChainId === -1 ? -1 : currentChainId as number} setChainId={setChainId} />
                <br />
                <button onClick={() => connector.deactivate()}>Disconnect</button>
            </>
        )
    } else {
        return (
            <>
                <MetaMaskChainSelect chainId={desiredChainId} setChainId={isActivating ? undefined : setChainId} />
                <br />
                <button
                    onClick={
                        isActivating
                            ? undefined
                            : () => connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
                    }
                    disabled={isActivating}
                >
                    {isActivating ? 'Connecting...' : `Connect ${getName(connector)}`}
                </button>
            </>
        )
    }
}

function getName(connector: Connector) {
    if (connector instanceof MetaMask) {
        return 'MetaMask'
    } else {
        return 'Unknown'
    }
}

function Status({connector}: { connector: Connector }) {
    const chainId = useChainId()
    const accounts = useAccounts()
    const error = useError()
    const isActivating = useIsActivating()
    const isActive = useIsActive()
  
    if (error) return (
        <div>{error.name ?? 'Error'}: {error.message}</div>
    )

    if (isActive) 
        if(isDesiredChainID(chainId)) return (
            <div>✅ Connected</div>
        )
        else return (
            <div>⚠️ Switch network</div>
        )
    else return (
        <div>⚠️ Disconnected</div>
    )
}

function Accounts() {
    const provider = useProvider()
    const accounts = useAccounts()
    const ENSNames = useENSNames(provider)
    const chainId = useChainId()


    const balances = useBalances(provider, accounts)

    return (
        <div>
        Account:
            {accounts === undefined
                ? ' -'
                : accounts.length === 0
                    ? ' None'
                    : accounts?.map((account, i) => (
                        <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <b>{ENSNames?.[i] ?? account}</b>
                            {balances?.[i] ? ` (${formatEther(balances[i])} ${getCurrencySymbol(chainId)})` : null}
                        </ul>
                    ))}
        </div>
    )
}

function getCurrencySymbol(chainId: number | undefined): string {
    if (chainId) {
        const chain = CHAINS[chainId]
        const extendedInfoChain = chain as ExtendedChainInformation
        if (extendedInfoChain.nativeCurrency) {
            return extendedInfoChain.nativeCurrency.symbol
        }
    }

    return 'Ξ'
}

function useBalances(
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined {
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

export default function MetamaskConnectCard() {
    return (
        <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
            <div
                    
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '20rem',
                    padding: '1rem',
                    margin: '1rem',
                    overflow: 'auto',
                    border: '1px solid',
                    borderRadius: '1rem',
                }}
            >
                <div>
                    <Status connector={metamaskConnector}/>
                    <br />
                    <ChainDetails/>
                    <Accounts />
                    <br />
                </div>
                <SwitchNetworkButton connector={metamaskConnector}/>
                <MetaMaskConnect connector={metamaskConnector} hooks={hooks} />
            </div>
        </div>
    )
}