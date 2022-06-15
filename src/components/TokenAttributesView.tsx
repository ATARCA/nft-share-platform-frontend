import React from "react";
import { Card } from "semantic-ui-react";
import { MetadataAttribute } from "../../types/NFTMetadata";

const TokenAttributesView = ({attributes}: {attributes: MetadataAttribute[]}) => {

    return (
        <div>
            <h2>Properties</h2>
            <Card.Group>
                {attributes.map( attribute => {
                    return <Card key={attribute.trait_type}>
                        <Card.Content>
                            <Card.Header>{attribute.trait_type}</Card.Header>
                            <Card.Description>{attribute.value}</Card.Description>
                        </Card.Content>
                    </Card>
                })}
            </Card.Group>
        </div>
    )
}

export default TokenAttributesView