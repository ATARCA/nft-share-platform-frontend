import { useEffect, useState } from "react"
import React from "react";
import { Icon, Input, Header, Button } from "semantic-ui-react";
import { v4 as uuidv4 } from 'uuid';
import { authorPropertyName, categoryPropertyName, MetadataAttribute, NFTMetadata } from "../types/NFTMetadata";

const MetadataEntryItem = ({
    propertyName, 
    propertyValue, 
    onRemoveClicked,
    onPropertyNameChanged,
    onPropertyValueChanged,
    className}: {
        propertyName: string, 
        propertyValue: string, 
        onRemoveClicked: () => void,
        onPropertyNameChanged: (newName: string) => void,
        onPropertyValueChanged: (newValue: string) => void,
        className?:string}) => {

    const [ currentPropertyName, setCurrentPropertyName ] = useState(propertyName)
    const [ currentPropertyValue, setcurrentPropertyValue ] = useState(propertyValue)

    return (
        <div className={className}>
            <Input placeholder='propertyName' className='margin-bottom'
                value={currentPropertyName} 
                error={!currentPropertyName}
                onChange={(e, { value }) => {setCurrentPropertyName( value ); onPropertyNameChanged(value)}}/>
            <Input placeholder='propertyValue' className='margin-bottom'
                value={currentPropertyValue} 
                error={!currentPropertyValue}
                onChange={(e, { value }) => {setcurrentPropertyValue( value ); onPropertyValueChanged(value)}}/>
            <Icon name='delete' size='small' onClick={onRemoveClicked}/>
        </div>
    )
};

interface MetadataAttributeUIEntry {
    id: string;
    name: string;
    value: string;
}

const twitterContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [{ id:uuidv4(), name:categoryPropertyName, value:'Twitter'},{ id:uuidv4(), name:authorPropertyName, value:''}, { id:uuidv4(), name:'Topic', value:''}, { id:uuidv4(), name:'Contribution URI', value:'http://'}]
const eventOrganiserContributionPropertiesTemplate: MetadataAttributeUIEntry[] = [{ id:uuidv4(), name:categoryPropertyName, value:'Event'}, { id:uuidv4(), name:'Organizer', value:''}, { id:uuidv4(), name:'Event Name', value:''}, { id:uuidv4(), name:'Event date', value:''}, { id:uuidv4(), name:'Event location', value:''}]

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
            const categoryExists = !! metadataAttributesArray.find( ( value ) => value.name === categoryPropertyName )
            const isValidNew = !!tokenName && !!tokenDescription && !!imageURL && propertiesNotEmpty && categoryExists
    
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
        arrayCopy.push({ id:uuidv4(), name:'',value:''})
        setMetadataAttributesArray(arrayCopy)
    }

    return (
        <div>
            <div className='margin-vertical' >
                <Input fluid 
                    label='Token name' 
                    placeholder='Title' 
                    value={tokenName} 
                    error={!tokenName && tokenNameEverChanged} 
                    onChange={(e, { value }) => {setTokenName( value ); setTokenNameEverChanged(true)}} />
            </div>
            <div className='margin-vertical'>
                <Input fluid
                    label='Description' 
                    placeholder='Token description' 
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
            <Button basic onClick={() => { setMetadataAttributesArray(twitterContributionPropertiesTemplate)}}>Twitter contribution</Button>
            <Button basic onClick={() => { setMetadataAttributesArray(eventOrganiserContributionPropertiesTemplate)}}>Event organiser</Button>
            {Array.from( metadataAttributesArray ).map( entry => { 
                const uuid = entry.id
                const propertyName = entry.name
                const propertyValue = entry.value

                return (
                    <MetadataEntryItem
                        className='margin-vertical'
                        key={uuid} 
                        propertyName={propertyName} 
                        propertyValue={propertyValue}
                        onRemoveClicked={() => removeProperty(uuid)}
                        onPropertyNameChanged={(newName) => updatePropertyName(uuid, newName) }
                        onPropertyValueChanged={(newValue => updatePropertyValue(uuid, newValue))}/>)})}
            <Icon name='plus' circular onClick={addEmptyProperty} style={{margin: '10px'}}/>

        </div>
    )
}