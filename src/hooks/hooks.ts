import { useEffect, useState } from "react"
import { receiverPropertyName, NFTMetadata, subContributionPropertyName, subContributorPropertyName } from "../types/NFTMetadata"
import useCookie from 'react-use-cookie';
import { ethers } from "ethers";
import { EndorseERC721, ShareableERC721 } from "../typechain-types";
import { hooks } from "../connectors/metaMaskConnector";
import { loadEndorseContract, loadLikeContract, loadShareContract } from "../contracts/ContractsUtils";
import { LikeERC721 } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { defaultErrorHandler } from "../graphql/errorHandlers";
import { theGraphApolloClient } from "../graphql/theGraphApolloClient";
import { GET_PROJECT_DETAILS, GET_TOKENS_OF_ADDRESS, GET_TOKEN_BY_ID } from "../queries-thegraph/queries";
import { TokenByIdQuery, TokenByIdQueryVariables, TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { addressesEqual, buildSubgraphTokenEntityId } from "../utils";
import { backendApolloClient } from "../graphql/backendApolloClient";
import { GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD, ADD_PENDING_METADATA, CONSENT_NEEDED } from "../queries-backend/queries";
import { GetMessageToSignForMetadataUploadQuery, GetMessageToSignForMetadataUploadQueryVariables } from "../queries-backend/types-backend/GetMessageToSignForMetadataUploadQuery";
import { AddPendingMetadataMutation, AddPendingMetadataMutationVariables } from "../queries-backend/types-backend/AddPendingMetadataMutation";
import { ProjectDetailsQuery, ProjectDetailsQueryVariables, ProjectDetailsQuery_project } from "../queries-thegraph/types-thegraph/ProjectDetailsQuery";
import { TokensQuery_tokens } from "../queries-thegraph/types-thegraph/TokensQuery";
import { TokensOfAddressQuery, TokensOfAddressQueryVariables, TokensOfAddressQuery_tokens } from "../queries-thegraph/types-thegraph/TokensOfAddressQuery";
import { ConsentNeededQuery, ConsentNeededQueryVariables } from "../queries-backend/types-backend/ConsentNeededQuery";
import { useParams } from "react-router-dom";
import { EndorseTokensOfTokenQuery_tokens } from "../queries-thegraph/types-thegraph/EndorseTokensOfTokenQuery";

const { useProvider, useAccounts, useIsActive, useAccount } = hooks

export const useMetadata = (token: TokensQuery_tokens | TokensOfAddressQuery_tokens | TokenByIdQuery_token | TokenByIdQuery_token | EndorseTokensOfTokenQuery_tokens | null | undefined, useDummyMetadata?: NFTMetadata): 
      [ tokenDisplayName: string , 
        tokenHolderDisplayName: string, 
        metadata: NFTMetadata | undefined , 
        consentMissing: boolean, 
        errorMessage: string] => {

    const [ metadata, setMetadata ] = useState<NFTMetadata|undefined>(undefined)
    const [ consentMissing, setConsentMissing ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect( () => {
        const fetchMetadata = async () => {

            if (useDummyMetadata) {
                setMetadata(useDummyMetadata)
                return
            }

            if ( !token || !token.metadataUri ) return

            try {
                const uri = token.metadataUri
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
    },[token, useDummyMetadata])

    const tokenName = metadata?.name
    const tokenSubcontributionName = metadata?.attributes?.find((attribute) => attribute.trait_type.toLowerCase() === subContributionPropertyName.toLowerCase())?.value 
    const tokenDisplayName = tokenSubcontributionName ? tokenSubcontributionName : tokenName

    const tokenHolderNameOriginal = metadata?.attributes?.find((attribute) => attribute.trait_type === receiverPropertyName)?.value 
    const tokenHolderNameSubcontributor = metadata?.attributes?.find((attribute) => attribute.trait_type.toLowerCase() === subContributorPropertyName.toLowerCase())?.value 
    const tokenHolderDisplayName = tokenHolderNameSubcontributor ? tokenHolderNameSubcontributor : tokenHolderNameOriginal

    return [tokenDisplayName || '', tokenHolderDisplayName || '', metadata, consentMissing, errorMessage]
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

export const useLastVisitedProjectCookie = (): [string, (projedId: string) => void] => {
    const [lastVisitedProjectInternal, setLastVisitedProjectInternal] = useCookie('lastVisitedProject', '');

    const setLastVisitedProject = (projectId: string) => {
        setLastVisitedProjectInternal(projectId, {days: 9999})
    };

    return [lastVisitedProjectInternal, setLastVisitedProject];
}

export const useLocalImageUrlHistory = (): [parsedUrlList: string[], addUrlToImageHistory: (newUrl: string) => void] => {
    const [urlList, setUrlList] = useCookie('imageUrlHistory', '');
    const URL_LIST_SEPARATOR = ' '
    
    const parseUrlList = (urlsAsString: string) : string[] => {
        return urlsAsString.split(URL_LIST_SEPARATOR)
    }

    const parsedUrlList = parseUrlList(urlList)

    const addUrlToImageHistory = (newUrl: string) => {
        parsedUrlList.push(newUrl)
        const urlListAsString = serializeUrls(parsedUrlList)
        setUrlList(urlListAsString, {days: 9999})
    };

    const serializeUrls = (urls: string[]) : string => {
        return urls.join(URL_LIST_SEPARATOR)
    }

    return [parsedUrlList, addUrlToImageHistory];
}

export const useShareContract = ( projectId: string) => {
    const [shareContract, setShareContract] = useState<ShareableERC721 | undefined>(undefined);
    const [ projectDetails, loading ] = useProjectDetails(projectId)
    const provider = useProvider();

    const shareContractAddress = projectDetails?.shareableContractAddress

    useEffect( () => {
        const loadContract = async () => {
            if (provider && shareContractAddress) {
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

export const useLikeContract = ( projectId: string) => {
    const [likeContract, setLikeContract] = useState<LikeERC721 | undefined>(undefined);
    const [ projectDetails, loading ] = useProjectDetails(projectId)
    const provider = useProvider();
    
    const likeContractAddress = projectDetails?.likeContractAddress

    useEffect( () => {
        const loadContract = async () => {
            if (provider && likeContractAddress) {
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

export const useEndorseContract = ( projectId: string) => {
    const [endorseContract, setEndorseContract] = useState<EndorseERC721 | undefined>(undefined);
    const [ projectDetails, loading ] = useProjectDetails(projectId)
    const provider = useProvider();
    
    const endorseContractAddress = projectDetails?.endorseContractAddress

    useEffect( () => {
        const loadContract = async () => {
            if (provider && endorseContractAddress) {
                try {
                    const contract = loadEndorseContract(endorseContractAddress, provider)
                    setEndorseContract(contract)
                } catch (error) {
                    console.log('useEndorseContract',error)
                }
            }
            else {
                setEndorseContract(undefined)
            }
        }
    
        loadContract()
    },[endorseContractAddress, provider])

    return endorseContract
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

export const useMintTokenAndUploadMetadata = (projectId: string, contractMintCaller: (receiverAddress: string, shareContract:ShareableERC721, endorseContract:EndorseERC721 | undefined ) => Promise<ethers.ContractTransaction>): 
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
    const shareContract = useShareContract(projectId)
    const endorseContract = useEndorseContract(projectId)
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
                const resultTransaction = await contractMintCaller(receiverAddress, shareContract, endorseContract)
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

export const useIsProjectOwner = (projectId: string): [isProjectOwner: boolean, projectDetailsLoading: boolean] => {
    const accounts = useAccounts()
    const active = useIsActive()
    const [projectDetails, projectDetailsLoading] =  useProjectDetails(projectId)

    if (!active) return [false, projectDetailsLoading]

    const activeAccount = accounts?.at(0) || "no account"

    const isProjectOwner = !! projectDetails?.operators.find(value => addressesEqual( activeAccount , value)) 

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

export const useProjectCategories = (projectId: string): [categories: string[] | undefined, projectDetailsLoading: boolean] => {
    const [projectDetails, projectDetailsLoading] = useProjectDetails(projectId)
    const categoryNames = projectDetails?.categories.map(value => value.id)
    return [categoryNames, projectDetailsLoading]
}

export const useConsentNeeded = (): [consentNeeded: boolean, refetchConsent: () => void] => {
    const active = useIsActive()
    const signingAddress = useAccount() || 'address undefined'

    const consentNeededResult = useQuery<ConsentNeededQuery, ConsentNeededQueryVariables>(CONSENT_NEEDED, {client: backendApolloClient, variables: {address:signingAddress} });
    const consentNeeded = consentNeededResult.data?.consentNeeded || false

    const refetchConsent = async () => await consentNeededResult.refetch()

    return [consentNeeded && active, refetchConsent]
}

export const useCurrentProjectId = (): string|undefined => {
    const projectName = useParams().projectName
    const tokenId = useParams().tokenId
    const contractAddress = useParams().contractAddress

    const [tokenDetails, tokenDetailsLoading] = useTokenDetails(contractAddress || 'N/A', BigNumber.from( tokenId || '0'))

    if (projectName) return projectName
    else return tokenDetails?.project.id
}

export const useCanCurrentAccountEndorse = ( tokenDetails: TokenByIdQuery_token | null | undefined) => {
    const accounts = useAccounts()
    const active = useIsActive()
    const address = accounts ? accounts[0]:''

    const originalTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: address, isOriginal: true, isSharedInstance: false, isLikeToken: false, isEndorseToken:false}});

    const endorseTokensResult = useQuery<TokensOfAddressQuery,TokensOfAddressQueryVariables>(GET_TOKENS_OF_ADDRESS, 
        {client: theGraphApolloClient, 
            pollInterval: 5000, 
            onError: defaultErrorHandler, 
            variables: {address: address, isOriginal: false, isSharedInstance: false, isLikeToken: false, isEndorseToken:true}});    

    if (active && accounts && tokenDetails && !originalTokensResult.loading && !endorseTokensResult.loading) {
        const isOriginalOrSharedToken = tokenDetails.isOriginal || tokenDetails.isSharedInstance
        const originalTokensInThisProject = originalTokensResult.data?.tokens.filter( (token) => token.project.id === tokenDetails.project.id) || []

        const endorseTokensForCurrentTokenByCurrentAccount = endorseTokensResult.data?.tokens.filter( (token) => token.endorsedParentToken?.id === tokenDetails.id) || []
        const hasAtLeastOneOriginalTokenInThisProject = originalTokensInThisProject.length !== 0
        const hasAlreadyEndorseTokenByCurrentAccount = endorseTokensForCurrentTokenByCurrentAccount.length !== 0

        const doesNotOwnCurrentToken = !addressesEqual(address, tokenDetails.ownerAddress)
        return  hasAtLeastOneOriginalTokenInThisProject && 
            doesNotOwnCurrentToken && 
            isOriginalOrSharedToken &&
            !hasAlreadyEndorseTokenByCurrentAccount
    }
    else return false
}