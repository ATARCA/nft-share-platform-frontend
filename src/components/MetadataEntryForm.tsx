import { useState } from "react"
import React from "react";
import { Icon, Input, Header, Button } from "semantic-ui-react";
import { v4 as uuidv4 } from 'uuid';

const MetadataEntryItem = ({
    propertyName, 
    propertyValue, 
    onRemoveClicked,
    onPropertyNameChanged,
    onPropertyValueChanged,
    style}: {
        propertyName: string, 
        propertyValue: string, 
        onRemoveClicked: () => void,
        onPropertyNameChanged: (newName: string) => void,
        onPropertyValueChanged: (newValue: string) => void,
        style: React.CSSProperties}) => {

    const [ currentPropertyName, setCurrentPropertyName ] = useState(propertyName)
    const [ currentPropertyValue, setcurrentPropertyValue ] = useState(propertyValue)

    return (
        <div style={style}>
            <Input focus placeholder='propertyName' style={{margin: '0px 10px 0px 0px'}}
                value={currentPropertyName} 
                onChange={(e, { value }) => {setCurrentPropertyName( value ); onPropertyNameChanged(value)}}/>
            <Input focus placeholder='propertyValue' style={{margin: '0px 10px 0px 0px'}}
                value={currentPropertyValue} 
                onChange={(e, { value }) => {setcurrentPropertyValue( value ); onPropertyValueChanged(value)}}/>
            <Icon name='delete' size='small' onClick={onRemoveClicked}/>
        </div>
    )
};

const twitterContributionPropertiesTemplate: [string, string, string][] = [[ uuidv4(), 'Author', ''], [ uuidv4(), 'Topic', ''], [ uuidv4(), 'Contribution URI', 'http://']]
const eventOrganiserContributionPropertiesTemplate: [string, string, string][] = [[ uuidv4(), 'Organizer', ''], [ uuidv4(), 'Event Name', ''], [ uuidv4(), 'Event date', ''], [ uuidv4(), 'Event location', '']]

export const MetadataEntryForm = () => {

    const [ tokenName, setTokenName ] = useState('')
    const [ tokenDescription, setTokenDescription ] = useState('')

    const [ propertiesToValuesArray, setPropertiesToValuesArray ] = useState<[string, string, string][]>([])

    const updatePropertyValue = (uuid: string, newValue:string) => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.map(( entry => {if (uuid === entry[0]) entry[2] = newValue; return entry}))
        setPropertiesToValuesArray(arrayCopy)
    }

    console.log('current map', propertiesToValuesArray)

    const updatePropertyName = (uuid: string, newPropertyName:string) => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.map(( entry => {if (uuid === entry[0]) entry[1] = newPropertyName; return entry}))
        setPropertiesToValuesArray(arrayCopy)
    }

    const demoContent: [string, string, string][] = [[ uuidv4(), 'a','1'],[ uuidv4(), 'b','2'],[ uuidv4(), 'c','3']];

    if (propertiesToValuesArray.length === 0) {
        setPropertiesToValuesArray(demoContent)//TODO remove
    }

    const removeProperty = (uuid: string) => {
        const filteredArray = propertiesToValuesArray.filter(((entry) => (uuid !== entry[0])))        
        setPropertiesToValuesArray(filteredArray)
    }

    const addEmptyProperty = () => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.push([ uuidv4(), '',''],)
        setPropertiesToValuesArray(arrayCopy)
    }
    return (
        <div>
            <div style={{margin: '10px 0px 0px 10px'}}><Input label='Name' placeholder='token name' value={tokenName} onChange={(e, { value }) => setTokenName( value )} /></div>
            <div style={{margin: '10px 0px 0px 10px'}}><Input label='Description' placeholder='token description' value={tokenDescription} onChange={(e, { value }) => setTokenDescription( value )}/></div>

            <Header as='h3' dividing>
                Properties
            </Header>
            <text>Choose template</text>
            <Button basic onClick={() => { setPropertiesToValuesArray(twitterContributionPropertiesTemplate)}}>Twitter contribution</Button>
            <Button basic onClick={() => { setPropertiesToValuesArray(eventOrganiserContributionPropertiesTemplate)}}>Event organiser</Button>
            {Array.from( propertiesToValuesArray ).map( (value, index) => { 
                const uuid = value[0]
                const propertyName = value[1]
                const propertyValue = value[2]

                return (
                    <MetadataEntryItem
                        style={{margin: '10px 0px 0px 10px'}}
                        key={uuid} 
                        propertyName={propertyName} 
                        propertyValue={propertyValue}
                        onRemoveClicked={() => removeProperty(uuid)}
                        onPropertyNameChanged={(newName) => updatePropertyName(uuid, newName) }
                        onPropertyValueChanged={(newValue => updatePropertyValue(uuid, newValue))}/>)})}
            <Icon name='plus' circular onClick={addEmptyProperty} style={{margin: '10px'}}
            />

        </div>
    )
}