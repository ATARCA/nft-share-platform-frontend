import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { useLocalImageUrlHistory } from "../hooks/hooks";
import { InputLabel } from "./InputForm/InputLabel";
import { InputLine } from "./InputForm/InputLine";

export const ImageUrlDropdown = ( {onUrlChanged} : {onUrlChanged: (url: string) => void}) => {
    const [parsedUrlList, addUrlToImageHistory] = useLocalImageUrlHistory()
    const [ imageURLEverChanged, setImageURLEverChanged ] = useState(false)
    const [ imageURL, setImageURL ] = useState('')

    const dropdownOptions = parsedUrlList.map( url => {return { key: url, text: url, value: url }})

    return <InputLine>
        <InputLabel label='Image URL'/>
      
        <Dropdown
            options={dropdownOptions}
            placeholder='http://..' 
            error={!imageURL && imageURLEverChanged} 
            search
            selection
            fluid
            allowAdditions
            value={imageURL}
            onAddItem={(e, { value }) => { if (value) addUrlToImageHistory(value?.toString())}}
            onChange={(e, { value }) => { if (value) {setImageURL( value.toString() ); setImageURLEverChanged(true); onUrlChanged(value.toString())}}}
        />

    </InputLine>
}