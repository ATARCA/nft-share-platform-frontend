import { useState } from "react"
import React from "react";
import { Icon, Input } from "semantic-ui-react";

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
            <Icon name='delete' size='small' circular onClick={onRemoveClicked}/>
        </div>
    )
};

export const MetadataEntryForm = () => {
//use state for properties and values map

    //const [ propertiesToValuesMap, setPropertiesToValuesMap ] = useState(new Map<string, string>())
    const [ propertiesToValuesArray, setPropertiesToValuesArray ] = useState<[string, string][]>([])

    const updatePropertyValue = (index: number, newValue:string) => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.map(((entry, i) => {if (i === index) entry[1] = newValue; return entry}))
        setPropertiesToValuesArray(arrayCopy)
    }

    console.log('current map', propertiesToValuesArray)

    const updatePropertyName = (index: number, newPropertyName:string) => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.map(((entry, i) => {if (i === index) entry[0] = newPropertyName; return entry}))
        setPropertiesToValuesArray(arrayCopy)
    }

    const demoContent: [string, string][] = [['a','1'],['b','2'],['c','3']];

    if (propertiesToValuesArray.length === 0) {
        setPropertiesToValuesArray(demoContent)//TODO remove
    }

    const removeProperty = (index: number) => {
        const filteredArray = propertiesToValuesArray.filter(((entry, i) => (i !== index)))        
        setPropertiesToValuesArray(filteredArray)
    }

    const addEmptyProperty = () => {
        const arrayCopy = [...propertiesToValuesArray]
        arrayCopy.push(['',''],)
        setPropertiesToValuesArray(arrayCopy)
    }
//TODO next - template button
    return (
        <div>
            {Array.from( propertiesToValuesArray ).map( (value, index) => { 
                const propertyName = value[0]
                const propertyValue = value[1]

                return (
                    <MetadataEntryItem
                        style={{margin: '10px 0px 0px 10px'}}
                        key={index} 
                        propertyName={propertyName} 
                        propertyValue={propertyValue}
                        onRemoveClicked={() => removeProperty(index)}
                        onPropertyNameChanged={(newName) => updatePropertyName(index, newName) }
                        onPropertyValueChanged={(newValue => updatePropertyValue(index, newValue))}/>)})}
            <Icon name='plus' circular onClick={addEmptyProperty} style={{margin: '10px'}}
            />

        </div>
    )
}