import React from "react"
import { Dropdown, Icon } from "semantic-ui-react"

export const TokenCategoryDropdown = () => {

    const options = [
        { key: 1, text: 'Choice 1 ', value: 1 },
        { key: 2, text: 'Choice 2 ', value: 2 },
    ]

    return (<Dropdown
        placeholder='All categories '
        compact
        selection
        options={options}
        icon='chevron down'
        onChange={ (event, data) => console.log(`selected value ${data.value}`)}
    >
    </Dropdown>)
}