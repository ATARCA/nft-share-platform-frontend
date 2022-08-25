import { useEffect, useState } from "react"
import React from "react";
import { Icon, Input, Header, Button } from "semantic-ui-react";
import { v4 as uuidv4 } from 'uuid';
import { receiverPropertyName, categoryPropertyName, MetadataAttribute, NFTMetadata } from "../types/NFTMetadata";

const CATEGORY_MAX_LENGTH = 32

const MetadataEntryItem = ({
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
                error={!currentPropertyValue}
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
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]

const educationContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Education', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]

const technologyContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Technology', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]
    
const securityContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Security', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]
        
const contentContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Content', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]
            
const competitionContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Competition', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]
                
                        
const communityHeroContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Community Hero', placeholder:''},
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:linkToContributionPropertyName, value:'http://', placeholder:''}]
                

const eventOrganiserContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [
    { id:uuidv4(), name:categoryPropertyName, value:'Events', placeholder:''}, 
    { id:uuidv4(), name:receiverPropertyName, value:'', placeholder:authoeNamePlaceholder}, 
    { id:uuidv4(), name:'Discord handle', value:'', placeholder:discordHandlePlaceholder}, 
    { id:uuidv4(), name:'Event name', value:'', placeholder:'Hackathon in Helsinki'}, 
    { id:uuidv4(), name:'Event date', value:'', placeholder:'20/12/2022'}, 
    { id:uuidv4(), name:'Event location', value:'', placeholder:'Helsinki, Finland'}]

export const MetadataEntryForm = ({onIsValid, onMetadataChanged, onCategoryChanged}: {onIsValid: (isValid:boolean) => void, onMetadataChanged: (metadata:string) => void, onCategoryChanged: (category:string | undefined) => void}) => {

    const [ tokenName, setTokenName ] = useState('')
    const [ tokenNameEverChanged, setTokenNameEverChanged ] = useState(false)

    const [ tokenDescription, setTokenDescription ] = useState('')
    const [ tokenDescriptionEverChanged, setTokenDescriptionEverChanged ] = useState(false)

    const [ imageURL, setImageURL ] = useState('')
    const [ imageURLEverChanged, setImageURLEverChanged ] = useState(false)

    const [ metadataAttributesArray, setMetadataAttributesArray ] = useState<MetadataAttributeUIEntry[]>([])

    const [ isValid, setIsValid ] = useState(false)

    const updatePropertyValue = (uuid: string, newValue:string) => {
        const arrayCopy = [...metadataAttributesArray]
        arrayCopy.map(( entry => {if (uuid === entry.id) entry.value = newValue; return entry}))
        setMetadataAttributesArray(arrayCopy)
    }

    useEffect(() => {
        const validateFields = () => {
            const propertiesNotEmpty = metadataAttributesArray.reduce<boolean>( (previous, current) => {return !!previous && !!current.name && !!current.value}, true)
            const categoryEntry = metadataAttributesArray.find( ( value ) => value.name === categoryPropertyName )
            const categoryExists = !! categoryEntry
            const categoryNotTooLong = (categoryEntry?.value.length || 0) <= CATEGORY_MAX_LENGTH
            const isValidNew = !!tokenName && !!tokenDescription && !!imageURL && propertiesNotEmpty && categoryExists && categoryNotTooLong
    
            setIsValid(isValidNew)
            onIsValid(isValidNew)
        }
    
        const postMetadataToCallback = () => {
            const attributes:MetadataAttribute[] = metadataAttributesArray.map( it => {return {trait_type: it.name, value: it.value}});
            const metadata: NFTMetadata = {description: tokenDescription, name: tokenName, image: imageURL, attributes}
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

    return (
        <div>
            <div className='margin-vertical' >
                <Input fluid 
                    label='Contribution title' 
                    placeholder='e.g. Tutorial videos or Community help' 
                    value={tokenName} 
                    error={!tokenName && tokenNameEverChanged} 
                    onChange={(e, { value }) => {setTokenName( value ); setTokenNameEverChanged(true)}} />
            </div>
            <div className='margin-vertical'>
                <Input fluid
                    label='Description' 
                    placeholder='Additional details - for token metadata only'//TODO show this in the token detail page 
                    value={tokenDescription} 
                    error={!tokenDescription && tokenDescriptionEverChanged} 
                    onChange={(e, { value }) => {setTokenDescription( value ); setTokenDescriptionEverChanged(true)}}/>
            </div>

            <div className='margin-vertical'>
                <Input fluid
                    label='Image URL' 
                    placeholder='http://..' 
                    value={imageURL} 
                    error={!imageURL && imageURLEverChanged} 
                    onChange={(e, { value }) => {setImageURL( value ); setImageURLEverChanged(true)}}/>
            </div>

            <Header as='h2' dividing>
                Properties
            </Header>
            
            <div className='margin-vertical'>Choose a template</div>
            <Button basic className="MetadataTemplateButton" onClick={() => { setMetadataAttributesArray(socialsContributionPropertiesTemplate)}}>Socials</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(educationContributionPropertiesTemplate)}}>Education</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(technologyContributionPropertiesTemplate)}}>Technology</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(securityContributionPropertiesTemplate)}}>Security</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(contentContributionPropertiesTemplate)}}>Content</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(competitionContributionPropertiesTemplate)}}>Competition</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(communityHeroContributionPropertiesTemplate)}}>Community Hero</Button>
            <Button basic className="MetadataTemplateButton"  onClick={() => { setMetadataAttributesArray(eventOrganiserContributionPropertiesTemplate)}}>Events</Button>
            {Array.from( metadataAttributesArray ).map( entry => { 
                const uuid = entry.id
                const propertyName = entry.name
                const propertyValue = entry.value
                const placeholder = entry.placeholder

                return (
                    <MetadataEntryItem
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