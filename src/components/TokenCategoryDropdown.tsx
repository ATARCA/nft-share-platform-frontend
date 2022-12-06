import React from "react"
import { Dropdown } from "semantic-ui-react"
import { useProjectCategories } from "../hooks/hooks"

export const ALL_CATEGORIES_VALUE = ''

export const TokenCategoryDropdown = ( { projectId, onCategoryChanged}: { projectId: string, onCategoryChanged: (category:string) => void}) => {

    const [projectCategories, loading] = useProjectCategories(projectId)

    const allCategoriesOption = [{ key: 'All categories', text: 'All categories', value: ALL_CATEGORIES_VALUE }]

    const options = projectCategories?.map( e => ({key: e, text:e, value:e}) ) 
    const allOptions = allCategoriesOption.concat( options || [])

    return (<Dropdown
        placeholder='All categories'
        compact
        selection
        options={allOptions}
        icon='chevron down'
        onChange={ (event, data) => onCategoryChanged(data.value?.toString() || ALL_CATEGORIES_VALUE)}
    >
    </Dropdown>)
}