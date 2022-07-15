import React from "react";
import { Card, Table } from "semantic-ui-react";
import { MetadataAttribute } from "../types/NFTMetadata";

const TokenAttributesView = ({attributes}: {attributes: MetadataAttribute[]}) => {

    return (
        <div>
            <Table basic='very' celled >
                <Table.Body>
                    {attributes.map( attribute => {
                        return <Table.Row key={attribute.trait_type}>
                            <Table.Cell collapsing>{attribute.trait_type}</Table.Cell>
                            <Table.Cell>{attribute.value}</Table.Cell> 
                            </Table.Row>
                        
                    })}
                </Table.Body>
            </Table>
        </div>
    )
}

export default TokenAttributesView