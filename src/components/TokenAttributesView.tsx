import React from "react";
import { Card, Table } from "semantic-ui-react";
import { ShareableTokenByIdQuery_shareableToken } from "../queries-thegraph/types-thegraph/ShareableTokenByIdQuery";
import { MetadataAttribute } from "../types/NFTMetadata";

const TokenAttributesView = ({token, attributes}: { token:ShareableTokenByIdQuery_shareableToken ,attributes: MetadataAttribute[]}) => {
    return (
        <div>
            <Table basic='very' >
                <Table.Body>
                    {attributes.map( attribute => {
                        return <Table.Row key={attribute.trait_type}>
                            <TitleTableCell>{attribute.trait_type}</TitleTableCell>
                            <ValueTableCell>{attribute.value}</ValueTableCell> 
                        </Table.Row>
                    })}
                    <Table.Row>
                        <TitleTableCell>Likes</TitleTableCell>
                        <ValueTableCell>{token.likeTokens.length}</ValueTableCell> 
                    </Table.Row>
                    <Table.Row>
                        <TitleTableCell>Shares</TitleTableCell>
                        <ValueTableCell>{token.sharedChildTokens.length}</ValueTableCell> 
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}

const TitleTableCell = (  {children}: { children: JSX.Element | string} ) => {
    return <Table.Cell collapsing className="Token-attribute-table-title">{children}</Table.Cell>
}

const ValueTableCell = (  {children}: { children: JSX.Element | string | number} ) => {
    return <Table.Cell className="Token-attribute-table-value">{children}</Table.Cell>
}

export default TokenAttributesView