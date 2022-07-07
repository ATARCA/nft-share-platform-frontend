import { useEffect, useState } from "react"
import { NFTMetadata } from "../../types/NFTMetadata"
import useCookie from 'react-use-cookie';
import { ShareableERC721 } from "../typechain-types/ShareableERC721";
import { hooks } from "../connectors/metaMaskConnector";
import { loadLikeContract, loadShareContract } from "../contracts/demoContract";
import { LikeERC721 } from "../typechain-types/LikeERC721";
import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "@apollo/client";
import { defaultErrorHandler } from "../graphql/errorHandlers";
import { theGraphApolloClient } from "../graphql/theGraphApolloClient";
import { GET_TOKEN_BY_ID } from "../queries-thegraph/queries";
import { ShareableTokenByIdQuery, ShareableTokenByIdQueryVariables, ShareableTokenByIdQuery_shareableToken } from "../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import { addressesEqual, buildSubgraphTokenEntityId } from "../utils";

const { useProvider, useAccounts, useIsActive } = hooks


const buildMetadataUri = (contractAddress: string, tokenId: string) => {
    //TODO after updating to new contracts load URI from contract or subgraph - do not build it here
    return `${process.env.REACT_APP_BACKEND_URI}/metadata/${contractAddress}/${tokenId}`
}

export const useMetadata = (contractAddress: string, tokenId: string): [ NFTMetadata | undefined ,boolean, string] => {
    const [ metadata, setMetadata ] = useState<NFTMetadata|undefined>(undefined)
    const [ consentMissing, setConsentMissing ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect( () => {
        const fetchMetadata = async () => {
            const uri = buildMetadataUri(contractAddress, tokenId)
            setErrorMessage('')
            const response = await fetch(uri)
            console.log('metadata response',response)

            if (response && response.status === 200) {
                const body = await response.json()
                const metadata = body as NFTMetadata
                setMetadata(metadata)
            } else if (response && response.status === 403) {
                setConsentMissing(true)
            }
            else {
                setErrorMessage(response.status+' '+response.statusText)
            }
        }
    
        fetchMetadata()
    },[contractAddress, tokenId])

    return [metadata, consentMissing, errorMessage]
}

export const useTutorialCompletedCookie = (): [boolean, (completed: boolean) => void] => {
    const [tutorialCompletedInternal, setTutorialCompletedInternal] = useCookie('tutorialCompleted', 'false');

    const setTutorialCompleted = (completed: boolean) => {
        if (completed)
            setTutorialCompletedInternal('true', {days: 9999})
        else
            setTutorialCompletedInternal('false', {days: 9999})
    };

    const tutorialCompleted = tutorialCompletedInternal === 'true';

    return [tutorialCompleted, setTutorialCompleted];
}

export const useShareContract = ( shareContractAddress: string) => {
    const [shareContract, setShareContract] = useState<ShareableERC721 | undefined>(undefined);

    const provider = useProvider();

    useEffect( () => {
        const loadContract = async () => {
            if (provider) {
                try {
                    const contract = loadShareContract(shareContractAddress, provider)
                    setShareContract(contract)
                } catch (error) {
                    console.log('useShareContract', error)
                }
            }
            else {
                setShareContract(undefined)
            }
        }
    
        loadContract()
    },[shareContractAddress, provider])

    return shareContract
}

export const useLikeContract = ( likeContractAddress: string) => {
    const [likeContract, setLikeContract] = useState<LikeERC721 | undefined>(undefined);

    const provider = useProvider();

    useEffect( () => {
        const loadContract = async () => {
            if (provider) {
                try {
                    const contract = loadLikeContract(likeContractAddress, provider)
                    setLikeContract(contract)
                } catch (error) {
                    console.log('useLikeContract',error)
                }
            }
            else {
                setLikeContract(undefined)
            }
        }
    
        loadContract()
    },[likeContractAddress, provider])

    return likeContract
}

export const useTokenDetails = (contractAddress: string, tokenId: BigNumber): [ShareableTokenByIdQuery_shareableToken | null | undefined, boolean] => {
    const detailedTokenEntityId = buildSubgraphTokenEntityId(contractAddress, BigNumber.from(tokenId)) 

    const detailedtokenQuery = useQuery<ShareableTokenByIdQuery,ShareableTokenByIdQueryVariables>(GET_TOKEN_BY_ID, {
        client: theGraphApolloClient, 
        pollInterval: 5000, 
        onError: defaultErrorHandler,
        variables: {id: detailedTokenEntityId}});

    const detailedToken = detailedtokenQuery.data?.shareableToken

    return [detailedToken, detailedtokenQuery.loading]
}

export const useIsCurrentAccountTokenOwner = ( tokenOwnerAddress: string) => {
    const accounts = useAccounts()
    const active = useIsActive()

    return (active && accounts) ? addressesEqual(accounts[0], tokenOwnerAddress) : false 
}