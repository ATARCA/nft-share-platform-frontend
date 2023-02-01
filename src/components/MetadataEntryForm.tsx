import { useEffect, useState } from "react"
import React from "react";
import { Icon, Input, Header, Button, Image } from "semantic-ui-react";
import { v4 as uuidv4 } from 'uuid';
import { receiverPropertyName, categoryPropertyName, MetadataAttribute, NFTMetadata } from "../types/NFTMetadata";
import { InputForm } from "./InputForm/InputForm";
import { InputLine } from "./InputForm/InputLine";
import { InputLabel } from "./InputForm/InputLabel";
import { ethers } from "ethers";
import { ImageUrlDropdown } from "./ImageUrlDropdown";
import { TokenCard } from "./TokenGrid";
import { TokensQuery_tokens } from "../queries-thegraph/types-thegraph/TokensQuery";
import { isAValidUrl } from "../utils";

const CATEGORY_MAX_LENGTH = 32

const MetadataKeyValueEntryItem = ({
    propertyName, 
    propertyValue, 
    placeholder,
    onRemoveClicked,
    onPropertyNameChanged,
    onPropertyValueChanged,
    className}: {
        propertyName: string, 
        propertyValue: string, 
        placeholder: string,
        onRemoveClicked: () => void,
        onPropertyNameChanged: (newName: string) => void,
        onPropertyValueChanged: (newValue: string) => void,
        className?:string}) => {

    const [ currentPropertyName, setCurrentPropertyName ] = useState(propertyName)
    const [ currentPropertyValue, setcurrentPropertyValue ] = useState(propertyValue)

    const isUrlItem = currentPropertyName === linkToContributionPropertyName
    const isItemValidUrl = isAValidUrl(currentPropertyValue)

    console.log(`propertyName ${propertyName} isUrlItem ${isUrlItem} isItemValidUrl ${isItemValidUrl}`)
    const isError = () => { if (isUrlItem) return !isItemValidUrl; else return !currentPropertyValue }

    const isCategoryItem = propertyName === categoryPropertyName

    return (
        <div className={className}>
            <Input placeholder='propertyName' className='margin-bottom'
                disabled={isCategoryItem}
                value={currentPropertyName} 
                error={!currentPropertyName}
                onChange={(e, { value }) => {setCurrentPropertyName( value ); onPropertyNameChanged(value)}}/>
            <Input placeholder={placeholder} className='margin-bottom'
                disabled={isCategoryItem}
                value={currentPropertyValue} 
                error={ isError() }
                onChange={(e, { value }) => {setcurrentPropertyValue( value ); onPropertyValueChanged(value)}}/>
            <Icon name='delete' size='small' onClick={onRemoveClicked} disabled={isCategoryItem}/>
        </div>
    )
};

interface MetadataAttributeUIEntry {
    id: string;
    name: string;
    value: string;
    placeholder: string;
}

const authoeNamePlaceholder = 'John Smith'
const discordHandlePlaceholder = 'johnsmith#1234'

const linkToContributionPropertyName = 'Link to contribution'

const socialsContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Socials', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]

const educationContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Education', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]

const technologyContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Technology', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]
    
const securityContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Security', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]
        
const contentContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Content', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]
            
const competitionContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Competition', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]
                
                        
const communityHeroContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Community Hero', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]
                

const eventOrganiserContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Events', placeholder:''}, 
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:'Event name', value:'', placeholder:'Hackathon in Helsinki'}, 
    { id:uuidv4(), name:'Event date', value:'', placeholder:'20/12/2022'}, 
    { id:uuidv4(), name:'Event location', value:'', placeholder:'Helsinki, Finland'}]

const streamTeamContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Stream Team', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'', placeholder:'http://'}]

const dummyToken: TokensQuery_tokens = { __typename: "Token",
    id: "string",
    ownerAddress: "any",
    contractAddress: "any",
    isOriginal: true,
    isSharedInstance: false,
    isOriginalOrShared:true,
    isLikeToken: false,
    isEndorseToken: false,
    tokenId: null,
    metadataUri: null,
    sharedChildTokens: [],
    likeTokens: [],
    likedParentToken: null
}

export const MetadataEntryForm = ({onIsValid, onMetadataChanged, onCategoryChanged, onReceiverAddressChanged}: 
    {onIsValid: (isValid:boolean) => void, 
        onMetadataChanged: (metadata:string) => void, 
        onCategoryChanged: (category:string | undefined) => void,
        onReceiverAddressChanged: (address: string | undefined) => void}) => {

    const [ receiverAddress, setReceiverAddress ] = useState('')
    const [ tokenName, setTokenName ] = useState('')
    const [ tokenNameEverChanged, setTokenNameEverChanged ] = useState(false)

    const [ tokenDescription, setTokenDescription ] = useState('')
    const [ tokenDescriptionEverChanged, setTokenDescriptionEverChanged ] = useState(false)

    const [ imageURL, setImageURL ] = useState('')
    const [ currentMetadata, setCurrentMetadata ] = useState<NFTMetadata | undefined>(undefined)

    const [ metadataAttributesArray, setMetadataAttributesArray ] = useState<MetadataAttributeUIEntry[]>([])

    const [ isValid, setIsValid ] = useState(false)

    const isValidAddress = ethers.utils.isAddress(receiverAddress)

    const updatePropertyValue = (uuid: string, newValue:string) => {
        const arrayCopy = [...metadataAttributesArray]
        arrayCopy.map(( entry => {if (uuid === entry.id) entry.value = newValue; return entry}))
        setMetadataAttributesArray(arrayCopy)
    }

    useEffect(() => {
        const validateFields = () => {
            const propertiesNotEmpty = metadataAttributesArray.reduce<boolean>( (previous, current) => {return !!previous && !!current.name && !!current.value}, true)
            
            const urlItem = metadataAttributesArray.find( ( value ) => value.name === linkToContributionPropertyName )
            const isUrlItemValidUrl = isAValidUrl(urlItem?.value)
            const isUrlItemValid = () => { if (urlItem != null) return isUrlItemValidUrl; else return true }

            const categoryEntry = metadataAttributesArray.find( ( value ) => value.name === categoryPropertyName )
            const categoryExists = !! categoryEntry
            const categoryNotTooLong = (categoryEntry?.value.length || 0) <= CATEGORY_MAX_LENGTH
            const isValidNew = !!tokenName && !!tokenDescription && !!imageURL && propertiesNotEmpty && categoryExists && categoryNotTooLong && isUrlItemValid()
    
            setIsValid(isValidNew)
            onIsValid(isValidNew)
        }
    
        const postMetadataToCallback = () => {
            const attributes:MetadataAttribute[] = metadataAttributesArray.map( it => {return {trait_type: it.name, value: it.value}});
            const metadata: NFTMetadata = {description: tokenDescription, name: tokenName, image: imageURL, attributes}
            setCurrentMetadata(metadata)
            const metadataJson = JSON.stringify(metadata, null, '\t')
            onMetadataChanged(metadataJson)

            const category = metadataAttributesArray.find( ( value ) => value.name === categoryPropertyName )?.value
            onCategoryChanged(category)
        }
        validateFields()
        postMetadataToCallback()
    }, [tokenDescription, tokenName, metadataAttributesArray, onIsValid, isValid, onMetadataChanged, imageURL, onCategoryChanged])

    const updatePropertyName = (uuid: string, newPropertyName:string) => {
        const arrayCopy = [...metadataAttributesArray]
        arrayCopy.map(( entry => {if (uuid === entry.id) entry.name = newPropertyName; return entry}))
        setMetadataAttributesArray(arrayCopy)
    }

    const removeProperty = (uuid: string) => {
        const filteredArray = metadataAttributesArray.filter(((entry) => (uuid !== entry.id)))        
        setMetadataAttributesArray(filteredArray)
    }

    const addEmptyProperty = () => {
        const arrayCopy = [...metadataAttributesArray]
        arrayCopy.push({ id:uuidv4(), name:'',value:'', placeholder:''})
        setMetadataAttributesArray(arrayCopy)
    }

    const setMetadataAttributesArrayAndClearUuid = (attributes: MetadataAttributeUIEntry[]) => {
        setMetadataAttributesArray(attributes.map(value => ({ ...value, id: uuidv4() })))
    }
    
    return (
        <div>
            <InputForm>
                <InputLine >
                    <InputLabel label='Contributor’s wallet address'/>
                    <Input fluid 
                        value={receiverAddress} 
                        error={!isValidAddress && !!receiverAddress}
                        onChange={(e, { value }) => {setReceiverAddress( value ); onReceiverAddressChanged(value)} }/>                
                </InputLine>

                <InputLine >
                    <InputLabel label='Contribution title' subLabel='e.g. Tutorial videos or Community help'/>

                    <Input fluid  
                        value={tokenName} 
                        error={!tokenName && tokenNameEverChanged} 
                        onChange={(e, { value }) => {setTokenName( value ); setTokenNameEverChanged(true)}} />
                </InputLine>

                <InputLine >
                    <InputLabel label='Description' subLabel='Visible on token detail page'/>

                    <Input fluid
                        //TODO show this in the token detail page 
                        value={tokenDescription} 
                        error={!tokenDescription && tokenDescriptionEverChanged} 
                        onChange={(e, { value }) => {setTokenDescription( value ); setTokenDescriptionEverChanged(true)}}/>

                </InputLine>

                <ImageUrlDropdown onUrlChanged={(url) => {setImageURL( url )}}/>

                <InputLine>
                    <InputLabel label='Token preview'/>
                    <TokenCard token={dummyToken} useDummyMetadata={currentMetadata}/>
                </InputLine>

            </InputForm>
            <Header as='h2' dividing>
                Properties
            </Header>
            
            <div className='margin-vertical'>Choose a template</div>
            <Button basic className="MetadataTemplateButton" onClick={() => { setMetadataAttributesArrayAndClearUuid(socialsContributionPropertiesTemplate)}}>Socials</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(educationContributionPropertiesTemplate)}}>Education</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(technologyContributionPropertiesTemplate)}}>Technology</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(securityContributionPropertiesTemplate)}}>Security</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(contentContributionPropertiesTemplate)}}>Content</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(competitionContributionPropertiesTemplate)}}>Competition</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(communityHeroContributionPropertiesTemplate)}}>Community Hero</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(eventOrganiserContributionPropertiesTemplate)}}>Events</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArrayAndClearUuid(streamTeamContributionPropertiesTemplate)}}>Stream Team</Button>
            {Array.from( metadataAttributesArray ).map( entry => { 
                const uuid = entry.id
                const propertyName = entry.name
                const propertyValue = entry.value
                const placeholder = entry.placeholder

                return (
                    <MetadataKeyValueEntryItem
                        className='margin-vertical'
                        key={uuid} 
                        propertyName={propertyName} 
                        propertyValue={propertyValue}
                        placeholder={placeholder}
                        onRemoveClicked={() => removeProperty(uuid)}
                        onPropertyNameChanged={(newName) => updatePropertyName(uuid, newName) }
                        onPropertyValueChanged={(newValue => updatePropertyValue(uuid, newValue))}/>)})}
            <Icon name='plus' circular onClick={addEmptyProperty} style={{margin: '10px'}}/>

        </div>
    )
}