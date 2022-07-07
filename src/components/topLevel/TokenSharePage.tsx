import React, { useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import { Button, Input, Message } from "semantic-ui-react";
import { useIsCurrentAccountTokenOwner, useShareContract, useTokenDetails } from "../../hooks/hooks";
import { shareContractAddress } from "../../utils";
import { hooks } from "../../connectors/metaMaskConnector";
import { BigNumber } from "@ethersproject/bignumber";
import { theGraphApolloClient } from "../../graphql/theGraphApolloClient";

const { useAccounts, useError, useIsActive } = hooks

const TokenSharePage = () => {

    const tokenId = useParams().tokenId || 'undefined'
    const contractAddress = useParams().contractAddress || 'undefined'

    const shareContract = useShareContract(shareContractAddress)
    const [ shareInProgress, setShareInProgress ] = useState(false)

    const [ receiverAddress, setReceiverAddress ] = useState('')
    const isValidAddress = ethers.utils.isAddress(receiverAddress)

    const [ tokenName, setTokenName ] = useState('')

    const [ errorMessage, setErrorMessage ] = useState('')
    const [ mintSuccess, setMintSuccess ] = useState(false)

    const [ detailedToken, detailedTokenLoading ] = useTokenDetails(contractAddress, BigNumber.from(tokenId))
    const isCurrentAccountTokenOwner = useIsCurrentAccountTokenOwner(detailedToken?.ownerAddress)


    const isActive = useIsActive()

    const metamaskError = useError()

    const onShareClicked = async () => {
        if (shareContract) {

            setShareInProgress(true)
            setErrorMessage('')
            setMintSuccess(false)
            try {
                const resultTransaction = await shareContract.share(receiverAddress, detailedToken?.tokenId)
                await resultTransaction.wait()
                setReceiverAddress('')
                setTokenName('')
                setMintSuccess(true)
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setErrorMessage(message)
            }
            setShareInProgress(false)
        }
    }

    return <div>
        { metamaskError ? <Message error header='Metamask error' content={metamaskError}/>: <></>}
        { errorMessage ? <Message error header='Transaction error' content={errorMessage}/>: <></>}
        { mintSuccess ? <Message header='Thanks for sharing your award! A new award token has been minted to your co-contributor with the given details.'/>: <></>}
    
        Token Share page tokenId {tokenId} contractAddress {contractAddress}

        { (!isCurrentAccountTokenOwner && isActive) ? <Message warning header='Cannot share token' content='Current account is not owner of this token and cannot share it.'/>: <></>}

        <div className='margin-vertical' >
            <Input fluid 
                label='Token receiver' 
                placeholder='address' 
                disabled={shareInProgress}
                value={receiverAddress} 
                error={!isValidAddress && !!receiverAddress}
                onChange={(e, { value }) => setReceiverAddress( value ) }/>
        </div>
        <div className='margin-vertical' >
            <Input fluid 
                label='Title of sub-contribution' 
                placeholder='token title' 
                disabled={shareInProgress}
                value={tokenName} 
                onChange={(e, { value }) => setTokenName( value ) }/>
        </div>

        <Button primary 
            disabled={ !isActive || !shareContract || !isCurrentAccountTokenOwner || !isValidAddress || !detailedToken || !tokenName } 
            onClick={onShareClicked} 
            loading={shareInProgress}>Share award</Button>
    </div>
}

export default TokenSharePage