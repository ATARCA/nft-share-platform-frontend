import { useEffect, useState } from "react"
import { NFTMetadata } from "../../types/NFTMetadata"

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