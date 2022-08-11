import { useEffect, useState } from "react"
import { NFTMetadata, subContributionPropertyName } from "../types/NFTMetadata"
import useCookie from 'react-use-cookie';
import { ethers } from "ethers";
import { ShareableERC721 } from "../typechain-types";
import { hooks } from "../connectors/metaMaskConnector";
import { loadLikeContract, loadShareContract } from "../contracts/demoContract";
import { LikeERC721 } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { defaultErrorHandler } from "../graphql/errorHandlers";
import { theGraphApolloClient } from "../graphql/theGraphApolloClient";
import { GET_PROJECT_DETAILS, GET_TOKEN_BY_ID } from "../queries-thegraph/queries";
import { TokenByIdQuery, TokenByIdQueryVariables, TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { addressesEqual, buildSubgraphTokenEntityId, projectId, shareContractAddress } from "../utils";
import { backendApolloClient } from "../graphql/backendApolloClient";
import { GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD, ADD_PENDING_METADATA } from "../queries-backend/queries";
import { GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables } from "../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { AddPendingMetadataMutation, AddPendingMetadataMutationVariables } from "../queries-backend/types-backend/AddPendingMetadataMutation";
import { ProjectDetailsQuery, ProjectDetailsQueryVariables, ProjectDetailsQuery_project } from "../queries-thegraph/types-thegraph/ProjectDetailsQuery";

const { useProvider, useAccounts, useIsActive } = hooks


const buildMetadataUri = (contractAddress: string, tokenId: string) => {
    //TODO after updating to new contracts load URI from contract or subgraph - do not build it here
    return `${process.env.REACT_APP_BACKEND_URI}/metadata/${contractAddress}/${tokenId}`
}

export const useMetadata = (contractAddress: string, tokenId: string): [ string , NFTMetadata | undefined ,boolean, string] => {
    const [ metadata, setMetadata ] = useState<NFTMetadata|undefined>(undefined)
    const [ consentMissing, setConsentMissing ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect( () => {
        const fetchMetadata = async () => {

            try {
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
            } catch (error) {
                const message = (error as any)?.message
                setErrorMessage(message)
            }
        }
    
        fetchMetadata()
    },[contractAddress, tokenId])

    const tokenName = metadata?.name
    const tokenSubcontributionName = metadata?.attributes.find((attribute) => attribute.trait_type === subContributionPropertyName)?.value 
    const tokenDisplayName = tokenSubcontributionName ? tokenSubcontributionName : tokenName

    return [tokenDisplayName || '', metadata, consentMissing, errorMessage]
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

export const useTokenDetails = (contractAddress: string, tokenId: BigNumber): [TokenByIdQuery_token | null | undefined, boolean] => {
    const detailedTokenEntityId = buildSubgraphTokenEntityId(contractAddress, BigNumber.from(tokenId)) 

    const detailedtokenQuery = useQuery<TokenByIdQuery,TokenByIdQueryVariables>(GET_TOKEN_BY_ID, {
        client: theGraphApolloClient, 
        pollInterval: 5000, 
        onError: defaultErrorHandler,
        variables: {id: detailedTokenEntityId}});

    const detailedToken = detailedtokenQuery.data?.token

    return [detailedToken, detailedtokenQuery.loading]
}

export const useIsCurrentAccountTokenOwner = ( tokenOwnerAddress: string) => {
    const accounts = useAccounts()
    const active = useIsActive()

    return (active && accounts) ? addressesEqual(accounts[0], tokenOwnerAddress) : false 
}

export const useMintTokenAndUploadMetadata = (contractMintCaller: (receiverAddress: string, contract:ShareableERC721 ) => Promise<ethers.ContractTransaction>): 
[   setMetadata: (metadata: string) => void, 
    isMetadataValid: boolean,
    setIsMetadataValid: (isMetadataValid: boolean) => void ,
    receiverAddress: string, 
    setReceiverAddress: (receiverAddress: string) => void,
    canMint: () => boolean,
    mintAndUploadMetadata: () => void,
    mintInProgress: boolean,
    metadaSignOrUploadFailed: boolean,
    retrySignAndUploadMetadata: () => void,
    metadataSignAndUploadInProgress: boolean,
    mintAndMetadaUploadCompleted: boolean,
    mintErrorMessage: string,
    metadataUploadErrorMessage: string,
    resetState: () => void
] => {

    const isActive = useIsActive()
    const shareContract = useShareContract(shareContractAddress)
    const accounts = useAccounts()
    const provider = useProvider();

    const [ metadata, setMetadata ] = useState('')
    const [ transactionHash, setTransactionHash ] = useState('')
    const [ receiverAddress, setReceiverAddress ] = useState('')
    const isValidAddress = ethers.utils.isAddress(receiverAddress)


    const [ mintErrorMessage, setMintErrorMessage ] = useState('')
    const [ metadataUploadErrorMessage, setMetadataUploadErrorMessage ] = useState('')

    const [ isMetadataValid, setIsMetadataValid ] = useState(false)

    const [ metadataSignAndUploadInProgress, setMetadataSignAndUploadInProgress ] = useState(false)
    const [ mintInProgress, setMintInProgress ] = useState(false)
    const [ mintAndMetadaUploadCompleted, setMintAndMetadaUploadCompleted ] = useState(false)

    const [ metadaSignOrUploadFailed, setMetadaSignOrUploadFailed ] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ getMetadataToSign, _metadataToSign]  = useLazyQuery<GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables>
    (GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD,
        {client: backendApolloClient, onError: defaultErrorHandler})

    const [addPendingMetadataFunction, addPendingMetadataResult] = useMutation<AddPendingMetadataMutation, AddPendingMetadataMutationVariables>(ADD_PENDING_METADATA,  {client: backendApolloClient, onError: defaultErrorHandler})

    const mint = async () => {
        if (shareContract && isActive) {
            setMintErrorMessage('')
            setMintInProgress(true)
            try {
                const resultTransaction = await contractMintCaller(receiverAddress, shareContract)
                resultTransaction.wait().then( () => setMintInProgress(false))
                return resultTransaction
            } catch (error) {
                console.log(error)
                const message = (error as any)?.message
                setMintErrorMessage(message)
                setMintInProgress(false)
            }
        }
    }

    const retrySignAndUploadMetadata = async () => {
        await signAndUploadMetadata(transactionHash)
    }

    const signAndUploadMetadata = async (txHash: string) => {
        setMetadataSignAndUploadInProgress(true)
        setMetadaSignOrUploadFailed(false)
        setMetadataUploadErrorMessage('')
        try {
            const result = await getMetadataToSign({variables: {txHash: txHash, metadata: metadata}})
            const messageToSign = result.data?.getMetadataUploadMessageToSign
            if (messageToSign && accounts) {
                const signingAddress = accounts[0]

                const signature = await provider?.getSigner().signMessage(messageToSign) || ''

                const metadataUploadResult = await addPendingMetadataFunction({variables: {pendingTxHash: txHash, metadata, signingAddress , signature}})
                if (metadataUploadResult.data?.addPendingMetadata.success) {
                    setMintAndMetadaUploadCompleted(true)
                }
                else {
                    setMetadaSignOrUploadFailed(true)
                    setMetadataUploadErrorMessage(metadataUploadResult.data?.addPendingMetadata.message || 'No errror message from failed metadata upload')
                }
            }
            else {
                console.error('Message to sign and account cannot be undefined')
                setMetadaSignOrUploadFailed(true)
            }
        } catch (error) {
            console.log(error)
            setMetadaSignOrUploadFailed(true)
            const message = (error as any)?.message
            setMetadataUploadErrorMessage(message)
        }

        setMetadataSignAndUploadInProgress(false)
    }

    const mintAndUploadMetadata = async () => {
        const transaction = await mint()
       
        if (transaction) {
            setTransactionHash(transaction.hash)
            signAndUploadMetadata(transaction.hash)
        }
        else {
            console.error('Transaction is null')
        }
    }

    const canMint = (): boolean => {
        return !mintInProgress 
        && !metadataSignAndUploadInProgress 
        && !metadaSignOrUploadFailed
        && isActive 
        && isValidAddress 
        && isMetadataValid
        && !!shareContract
    }

    const resetState = () => {
        setMintAndMetadaUploadCompleted(false)
        setReceiverAddress('')
    }

    return [setMetadata, 
        isMetadataValid, 
        setIsMetadataValid, 
        receiverAddress, 
        setReceiverAddress, 
        canMint, 
        mintAndUploadMetadata,
        mintInProgress,
        metadaSignOrUploadFailed,
        retrySignAndUploadMetadata,
        metadataSignAndUploadInProgress, 
        mintAndMetadaUploadCompleted, 
        mintErrorMessage, 
        metadataUploadErrorMessage,
        resetState]
}

export const useIsProjectOwner = (): [isProjectOwner: boolean, projectDetailsLoading: boolean] => {
    const accounts = useAccounts()
    const active = useIsActive()
    const [projectDetails, projectDetailsLoading] =  useProjectDetails(projectId)

    if (!active) return [false, projectDetailsLoading]

    const activeAccount = accounts?.at(0) || "no account"

    const isProjectOwner = addressesEqual( activeAccount , projectDetails?.owner)

    return [isProjectOwner, projectDetailsLoading]
}

export const useProjectDetails = (projectId: string): [projectDetails: ProjectDetailsQuery_project | null | undefined, projectDetailsLoading: boolean] => {
    const projectDetailQuery = useQuery<ProjectDetailsQuery,ProjectDetailsQueryVariables>(GET_PROJECT_DETAILS, {
        client: theGraphApolloClient, 
        pollInterval: 5000, 
        onError: defaultErrorHandler,
        variables: { projectId }});

    const projectDetails = projectDetailQuery.data?.project
    
    return [ projectDetails, projectDetailQuery.loading ]
}